'use client';

import { useLanguage } from '@/lib/i18n/context';

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => setLocale('en')}
        className="px-2 py-1 rounded text-[11px] font-bold tracking-widest transition-colors duration-150"
        style={{ color: locale === 'en' ? '#38F0FF' : 'var(--text-dim)' }}
      >
        EN
      </button>
      <span style={{ color: 'rgba(56,240,255,0.18)', fontSize: '10px' }}>|</span>
      <button
        onClick={() => setLocale('ka')}
        className="px-2 py-1 rounded text-[11px] font-bold tracking-widest transition-colors duration-150"
        style={{ color: locale === 'ka' ? '#38F0FF' : 'var(--text-dim)' }}
      >
        GE
      </button>
    </div>
  );
}
