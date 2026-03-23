import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

export default function Hero() {
  const words = ['Name.', 'Dedicate.', 'Immortalize.'];

  return (
    <section className="text-center flex flex-col items-center gap-6 pt-10 pb-4 px-4">

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest"
        style={{
          background: 'rgba(122,95,255,0.10)',
          border: '1px solid rgba(122,95,255,0.25)',
          color: '#a78bfa',
          boxShadow: '0 0 20px rgba(122,95,255,0.15)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse inline-block" />
        STELLAR BLOCKCHAIN — LIVE ON TESTNET
      </div>

      {/* Headline */}
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {words.map((word, i) => (
          <span
            key={word}
            className="animate-word inline-block mr-3"
            style={{ animationDelay: `${i * 160 + 200}ms` }}
          >
            <span style={{ color: i === 0 ? '#FFD166' : i === 1 ? '#38F0FF' : '#f1f5f9' }}>
              {word}
            </span>
          </span>
        ))}
        <br />
        <span
          className="animate-word inline-block text-3xl sm:text-4xl mt-2"
          style={{
            animationDelay: '700ms',
            background: 'linear-gradient(135deg, #7A5FFF, #38F0FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          A Star in the Sky.
        </span>
      </h1>

      {/* Subtext */}
      <p
        className="text-base sm:text-lg max-w-lg leading-relaxed animate-fade-up"
        style={{ color: 'var(--text-secondary)', animationDelay: '600ms', opacity: 0 }}
      >
        Register a real star on the Stellar blockchain as an eternal, personal gift.
        Every star is sealed with a unique transaction hash — verifiable forever.
      </p>

      {/* CTA group */}
      <div
        className="flex flex-col sm:flex-row items-center gap-3 animate-fade-up"
        style={{ animationDelay: '800ms', opacity: 0 }}
      >
        <Link
          href="/create"
          className="btn-stellar px-8 py-4 rounded-xl text-base font-bold flex items-center gap-2 animate-glow-pulse"
        >
          <Star size={18} />
          Name a Star
          <ArrowRight size={16} />
        </Link>
        <Link
          href="#pricing"
          className="btn-ghost px-6 py-4 rounded-xl text-sm font-medium"
        >
          View Packages
        </Link>
      </div>

      {/* Trust row */}
      <div
        className="flex items-center gap-4 text-[11px] flex-wrap justify-center animate-fade-up"
        style={{ color: 'var(--text-dim)', animationDelay: '1000ms', opacity: 0 }}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
          Blockchain-verified
        </span>
        <span className="text-white/10">·</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]" />
          Real star coordinates
        </span>
        <span className="text-white/10">·</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38F0FF]" />
          Eternal record
        </span>
      </div>
    </section>
  );
}
