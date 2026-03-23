import Link from 'next/link';
import { USEFUL_LINKS } from '@/lib/constants';
import type { UsefulLink } from '@/lib/types';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const accentMap = {
  gold:   { border: 'rgba(255,209,102,0.15)', hover: 'rgba(255,209,102,0.08)', text: '#FFD166' },
  cyan:   { border: 'rgba(56,240,255,0.15)',  hover: 'rgba(56,240,255,0.06)',  text: '#38F0FF' },
  purple: { border: 'rgba(122,95,255,0.15)',  hover: 'rgba(122,95,255,0.06)', text: '#a78bfa' },
};

function LinkCard({ link }: { link: UsefulLink }) {
  const accent = accentMap[link.accent];
  const Inner = (
    <div
      className="group rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: 'rgba(15,31,61,0.45)',
        border: `1px solid ${accent.border}`,
      }}
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl leading-none">{link.icon}</span>
        <span className="text-[var(--text-dim)] group-hover:text-[var(--text-secondary)] transition-colors">
          {link.external ? <ArrowUpRight size={14} /> : <ArrowRight size={14} />}
        </span>
      </div>
      <div>
        <p className="text-white text-sm font-semibold">{link.subtitle}</p>
        <p className="text-[10px] font-mono mt-0.5" style={{ color: accent.text }}>{link.title}</p>
      </div>
      <p className="text-[var(--text-secondary)] text-xs leading-relaxed">{link.desc}</p>
    </div>
  );

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {Inner}
      </a>
    );
  }
  return <Link href={link.href}>{Inner}</Link>;
}

export default function UsefulLinks() {
  return (
    <section className="w-full">
      <p className="text-center text-[var(--text-dim)] text-xs mb-8 tracking-widest uppercase">
        — Explore the Platform —
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {USEFUL_LINKS.map(link => (
          <LinkCard key={link.title} link={link} />
        ))}
      </div>
    </section>
  );
}
