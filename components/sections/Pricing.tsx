import Link from 'next/link';
import { PRICING_PLANS } from '@/lib/constants';
import type { PricingPlan } from '@/lib/types';
import { Check, Star, Zap } from 'lucide-react';

const accentMap = {
  gold:   {
    border: 'rgba(255,209,102,0.30)',
    glow:   '0 0 40px rgba(255,209,102,0.15)',
    text:   '#FFD166',
    bg:     'rgba(255,209,102,0.06)',
    btn:    'btn-primary',
  },
  cyan:   {
    border: 'rgba(56,240,255,0.25)',
    glow:   '0 0 40px rgba(56,240,255,0.10)',
    text:   '#38F0FF',
    bg:     'rgba(56,240,255,0.04)',
    btn:    '',
  },
  purple: {
    border: 'rgba(122,95,255,0.30)',
    glow:   '0 0 40px rgba(122,95,255,0.15)',
    text:   '#a78bfa',
    bg:     'rgba(122,95,255,0.06)',
    btn:    'btn-stellar',
  },
};

function PlanCard({ plan }: { plan: PricingPlan }) {
  const a = accentMap[plan.accent];
  return (
    <div
      className="glass-card p-6 flex flex-col gap-5 relative transition-all duration-300 hover:-translate-y-1"
      style={{
        borderColor: a.border,
        boxShadow: plan.popular ? a.glow : '0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      {/* Badge */}
      {plan.badge && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1"
          style={{ background: a.bg, border: `1px solid ${a.border}`, color: a.text }}
        >
          <Zap size={9} />
          {plan.badge}
        </div>
      )}

      {/* Header */}
      <div>
        <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-1">{plan.name}</p>
        <div className="flex items-end gap-1">
          <span
            className="text-4xl font-bold"
            style={{ fontFamily: 'Georgia, serif', color: a.text }}
          >
            {plan.price}
          </span>
          <span className="text-[var(--text-secondary)] text-sm mb-1.5">{plan.currency}</span>
        </div>
        <p className="text-[var(--text-secondary)] text-xs mt-1 leading-relaxed">{plan.description}</p>
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-2.5 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
            <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: a.text }} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/create"
        className={`${a.btn || 'btn-ghost'} px-5 py-3 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-1.5`}
        style={!a.btn ? { borderColor: a.border, color: a.text } : {}}
      >
        <Star size={14} />
        Get Started
      </Link>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="w-full">
      <p className="text-center text-[var(--text-dim)] text-xs mb-2 tracking-widest uppercase">
        — Packages —
      </p>
      <h2
        className="text-2xl sm:text-3xl font-bold text-center mb-8"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Choose Your{' '}
        <span style={{ color: '#FFD166' }}>Cosmic Package</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PRICING_PLANS.map(plan => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
