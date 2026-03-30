'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(56,240,255,0.15)',
  borderRadius: '12px',
  color: 'var(--text-primary)',
  padding: '12px 16px',
  width: '100%',
  outline: 'none',
  fontSize: '14px',
} as const;

export default function LoginPage() {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    router.push('/missions');
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md" style={{ borderColor: 'rgba(56,240,255,0.20)' }}>
        <div className="text-center mb-8">
          <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-2">— SkyWatcher —</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{t('auth.login')}</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" placeholder={t('auth.email')} value={email}
            onChange={e => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder={t('auth.password')} value={password}
            onChange={e => setPassword(e.target.value)} style={inputStyle} required />
          {error && <p className="text-xs text-center" style={{ color: '#f87171' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary py-3 rounded-xl text-sm font-bold mt-2">
            {loading ? t('auth.loggingIn') : t('auth.login')}
          </button>
        </form>
        <p className="text-center mt-6 text-xs" style={{ color: 'var(--text-dim)' }}>
          {t('auth.noAccount')}{' '}
          <Link href="/signup" style={{ color: '#38F0FF' }}>{t('nav.signup')}</Link>
        </p>
      </div>
    </div>
  );
}
