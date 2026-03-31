'use client';
// Note: disable email confirmation in Supabase Dashboard → Auth → Providers → Email → uncheck "Confirm email"
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

export default function SignupPage() {
  const { signUp, signIn } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError(t('auth.passwordMismatch')); return; }
    setLoading(true);
    try {
      const { error: signUpError } = await signUp(email, password, name);
      if (signUpError) { setError(signUpError); return; }
      const { error: signInError } = await signIn(email, password);
      if (!signInError) {
        router.push('/missions');
      } else {
        setError('ანგარიში შეიქმნა! შეამოწმე ელ.ფოსტა დასადასტურებლად.');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md" style={{ borderColor: 'rgba(56,240,255,0.20)' }}>
        <div className="text-center mb-8">
          <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-2">— SkyWatcher —</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{t('auth.signup')}</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder={t('auth.name')} value={name}
            onChange={e => setName(e.target.value)} style={inputStyle} required />
          <input type="email" placeholder={t('auth.email')} value={email}
            onChange={e => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder={t('auth.password')} value={password}
            onChange={e => setPassword(e.target.value)} style={inputStyle} required minLength={6} />
          <input type="password" placeholder={t('auth.confirmPassword')} value={confirm}
            onChange={e => setConfirm(e.target.value)} style={inputStyle} required />
          {error && (
            <p className="text-xs text-center px-2" style={{ color: error.includes('შეიქმნა') ? '#34d399' : '#f87171' }}>
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn-primary py-3 rounded-xl text-sm font-bold mt-2">
            {loading ? t('auth.creatingAccount') : t('auth.signup')}
          </button>
        </form>
        <p className="text-center mt-6 text-xs" style={{ color: 'var(--text-dim)' }}>
          {t('auth.hasAccount')}{' '}
          <Link href="/login" style={{ color: '#38F0FF' }}>{t('auth.login')}</Link>
        </p>
      </div>
    </div>
  );
}
