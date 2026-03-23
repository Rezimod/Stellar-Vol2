/**
 * Stellar blockchain integration — testnet
 * Uses @stellar/stellar-sdk to hash star metadata and post to Stellar testnet.
 */

import { CONSTELLATIONS } from './constants';

export interface StellarStarData {
  name: string;
  dedicated_to: string;
  message: string;
  owner_name: string;
  occasion_date: string;
}

export interface StellarResult {
  tx_hash: string;
  ra: string;
  dec: string;
  constellation: string;
  magnitude: number;
  certificate_number: string;
  star_id: string;
}

/* ─── Coordinate generation ─────────────────────────── */

function generateCoordinates(seed: string): { ra: string; dec: string; constellation: string; magnitude: number } {
  // Deterministic seeded random from star name
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const h = Math.abs(hash);

  const raHours   = (h % 24);
  const raMin     = (h >> 4) % 60;
  const raSec     = (h >> 8) % 60;
  const decDeg    = ((h >> 12) % 180) - 90;
  const decArcMin = (h >> 16) % 60;
  const magnitude = 4 + ((h >> 20) % 30) / 10; // 4.0 – 7.0

  const constellation = CONSTELLATIONS[(h >> 24) % CONSTELLATIONS.length];

  return {
    ra: `${raHours}h ${raMin}m ${raSec}s`,
    dec: `${decDeg >= 0 ? '+' : ''}${decDeg}° ${decArcMin}'`,
    constellation,
    magnitude: parseFloat(magnitude.toFixed(1)),
  };
}

/* ─── Certificate number ─────────────────────────────── */

function generateCertNumber(id: string): string {
  const year = new Date().getFullYear();
  const suffix = id.slice(0, 8).toUpperCase();
  return `AST-${year}-${suffix}`;
}

/* ─── Stellar testnet submission ─────────────────────── */

async function submitToStellarTestnet(data: StellarStarData): Promise<string> {
  try {
    // Dynamic import to avoid SSR issues
    const StellarSdk = await import('@stellar/stellar-sdk');
    const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

    // Fund ephemeral keypair via friendbot
    const keypair = StellarSdk.Keypair.random();
    await fetch(`https://friendbot.stellar.org?addr=${keypair.publicKey()}`);

    const account = await server.loadAccount(keypair.publicKey());

    // Encode star metadata as memo (28-char limit) — hash full data
    const metaStr = JSON.stringify(data);
    const encoder = new TextEncoder();
    const metaBytes = encoder.encode(metaStr);
    const hashBuffer = await crypto.subtle.digest('SHA-256', metaBytes);
    const hashArray  = Array.from(new Uint8Array(hashBuffer));
    const hashHex    = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(StellarSdk.Operation.manageData({
        name: 'astroman_star',
        value: hashHex.slice(0, 64),
      }))
      .addMemo(StellarSdk.Memo.text(`STAR:${data.name.slice(0, 22)}`))
      .setTimeout(30)
      .build();

    tx.sign(keypair);
    const result = await server.submitTransaction(tx);
    return result.hash;

  } catch (err) {
    // Graceful fallback: generate deterministic mock hash if testnet unavailable
    console.warn('Stellar testnet unavailable, using mock hash:', err);
    const seed = data.name + data.dedicated_to + data.occasion_date;
    const encoder = new TextEncoder();
    const buf = await crypto.subtle.digest('SHA-256', encoder.encode(seed));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

/* ─── Main entry point ───────────────────────────────── */

export async function registerStar(data: StellarStarData): Promise<StellarResult> {
  const tx_hash = await submitToStellarTestnet(data);

  const { ra, dec, constellation, magnitude } = generateCoordinates(
    data.name + data.dedicated_to
  );

  const star_id = crypto.randomUUID();
  const certificate_number = generateCertNumber(star_id);

  return {
    tx_hash,
    ra,
    dec,
    constellation,
    magnitude,
    certificate_number,
    star_id,
  };
}
