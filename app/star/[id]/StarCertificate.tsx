'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Star, Share2, Copy, Check, ExternalLink, ArrowLeft } from 'lucide-react';
import type { StarRecord } from '@/lib/types';

const STELLAR_TESTNET_EXPLORER = 'https://stellar.expert/explorer/testnet/tx/';

interface Props { star: StarRecord }

export default function StarCertificate({ star }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://stellar.astroman.ge/star/${star.id}`;

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-page-enter">

      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[var(--text-dim)] hover:text-[var(--text-secondary)] text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to home
      </Link>

      {/* Certificate */}
      <div className="certificate-card p-6 sm:p-10">

        {/* Top header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-mono tracking-widest text-[var(--text-dim)] uppercase">
              Astroman Stellar
            </p>
            <p className="text-[10px] font-mono text-[var(--text-dim)] mt-0.5">
              {star.certificate_number}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center animate-float"
            style={{
              background: 'rgba(255,209,102,0.10)',
              border: '1px solid rgba(255,209,102,0.25)',
              boxShadow: '0 0 20px rgba(255,209,102,0.20)',
            }}
          >
            <Star size={18} style={{ color: '#FFD166' }} />
          </div>
        </div>

        <div className="ornament-line mb-6" />

        {/* Star name */}
        <div className="text-center mb-6">
          <p className="text-xs font-mono tracking-widest text-[var(--text-dim)] uppercase mb-3">
            ✦ Official Star Registry ✦
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-2"
            style={{
              fontFamily: 'Georgia, serif',
              background: 'linear-gradient(135deg, #FFD166, #FFE08A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {star.name}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Dedicated to <span className="text-white font-semibold">{star.dedicated_to}</span>
          </p>
          <p className="text-[var(--text-dim)] text-xs mt-1">{star.created_at?.split('T')[0]}</p>
        </div>

        {/* Coordinates grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-xl"
          style={{ background: 'rgba(56,240,255,0.03)', border: '1px solid rgba(56,240,255,0.08)' }}
        >
          {[
            { label: 'Constellation', value: star.constellation },
            { label: 'Right Ascension', value: star.ra },
            { label: 'Declination', value: star.dec },
            { label: 'Magnitude', value: `${star.magnitude}` },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-[9px] font-mono text-[var(--text-dim)] uppercase tracking-widest mb-1">{label}</p>
              <p className="text-white text-xs font-mono font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {/* Message */}
        {star.message && (
          <div
            className="mb-6 p-4 rounded-xl"
            style={{ background: 'rgba(255,209,102,0.04)', border: '1px solid rgba(255,209,102,0.10)' }}
          >
            <p
              className="text-[var(--text-secondary)] text-sm leading-relaxed italic text-center"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              "{star.message}"
            </p>
            <p className="text-center text-[10px] text-[var(--text-dim)] mt-2">
              — {star.owner_name}
            </p>
          </div>
        )}

        <div className="ornament-line mb-6" />

        {/* Blockchain proof */}
        <div
          className="p-4 rounded-xl flex flex-col gap-2"
          style={{ background: 'rgba(122,95,255,0.05)', border: '1px solid rgba(122,95,255,0.12)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Stellar Blockchain Proof</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="flex-1 text-[10px] font-mono text-[var(--text-dim)] truncate">
              {star.tx_hash}
            </p>
            <a
              href={`${STELLAR_TESTNET_EXPLORER}${star.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-[#7A5FFF] hover:text-[#a78bfa] transition-colors"
              title="View on Stellar Expert"
            >
              <ExternalLink size={13} />
            </a>
          </div>
          <p className="text-[9px] text-[var(--text-dim)]">
            Transaction sealed on Stellar Testnet · Permanent record
          </p>
        </div>
      </div>

      {/* Share actions */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => copy(shareUrl)}
          className="btn-ghost w-full sm:w-auto px-5 py-3 rounded-xl text-sm flex items-center justify-center gap-2"
        >
          {copied ? <Check size={15} style={{ color: '#34d399' }} /> : <Copy size={15} />}
          {copied ? 'Copied!' : 'Copy Share Link'}
        </button>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={() => navigator.share({ title: `Star "${star.name}"`, url: shareUrl })}
            className="btn-stellar w-full sm:w-auto px-5 py-3 rounded-xl text-sm flex items-center justify-center gap-2"
          >
            <Share2 size={15} />
            Share Star
          </button>
        )}

        <Link
          href="/create"
          className="btn-ghost w-full sm:w-auto px-5 py-3 rounded-xl text-sm flex items-center justify-center gap-2"
        >
          <Star size={15} />
          Name Another Star
        </Link>
      </div>
    </div>
  );
}
