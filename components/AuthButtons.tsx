'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

export default function AuthButtons() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="btn-ghost px-4 py-2 rounded-xl text-xs font-bold"
        style={{ borderColor: 'rgba(56,240,255,0.20)', color: 'var(--text-secondary)' }}
      >
        {t('nav.login')}
      </Link>
      <Link
        href="/signup"
        className="btn-primary px-4 py-2 rounded-xl text-xs font-bold"
      >
        {t('nav.signup')}
      </Link>
    </div>
  );
}
