import { NextRequest, NextResponse } from 'next/server';
import { registerStar } from '@/lib/stellar';
import { saveStar } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { starName, ownerName, dedicatedTo, occasionDate, message } = body;

    if (!starName || !ownerName || !dedicatedTo || !occasionDate || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ error: 'Message too short' }, { status: 400 });
    }

    // Register on Stellar testnet + generate coordinates
    const result = await registerStar({
      name: starName.trim(),
      dedicated_to: dedicatedTo.trim(),
      message: message.trim(),
      owner_name: ownerName.trim(),
      occasion_date: occasionDate,
    });

    // Persist to Supabase
    await saveStar({
      id: result.star_id,
      name: starName.trim(),
      dedicated_to: dedicatedTo.trim(),
      message: message.trim(),
      owner_name: ownerName.trim(),
      ra: result.ra,
      dec: result.dec,
      constellation: result.constellation,
      magnitude: result.magnitude,
      tx_hash: result.tx_hash,
      certificate_number: result.certificate_number,
    });

    return NextResponse.json({ id: result.star_id });

  } catch (err) {
    console.error('[stars/create]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
