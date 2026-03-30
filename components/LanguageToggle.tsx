'use client';

import { useLanguage } from '@/lib/i18n/context';

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="flex items-center rounded-full text-xs font-bold tracking-widest overflow-hidden"
      style={{
        border: '1px solid rgba(56,240,255,0.20)',
        background: 'rgba(56,240,255,0.04)',
      }}
    >
      <button
        onClick={() => setLocale('en')}
        className="px-3 py-1.5 transition-colors duration-200"
        style={{
          background: locale === 'en' ? 'rgba(56,240,255,0.15)' : 'transparent',
          color: locale === 'en' ? '#38F0FF' : 'var(--text-dim)',
        }}
      >
        EN
      </button>
      <span style={{ color: 'rgba(56,240,255,0.20)' }}>|</span>
      <button
        onClick={() => setLocale('ka')}
        className="px-3 py-1.5 transition-colors duration-200"
        style={{
          background: locale === 'ka' ? 'rgba(56,240,255,0.15)' : 'transparent',
          color: locale === 'ka' ? '#38F0FF' : 'var(--text-dim)',
        }}
      >
        GE
      </button>
    </div>
  );
}
