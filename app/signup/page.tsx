'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

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
  const { signUp, signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError(t('auth.passwordMismatch')); return; }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) { setError(error); return; }
    setSuccess(t('auth.signupSuccess'));
  }

  async function handleGoogle() {
    const { error } = await signInWithGoogle();
    if (error) setError(error);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div
        className="glass-card p-8 w-full max-w-md"
        style={{ borderColor: 'rgba(56,240,255,0.20)' }}
      >
        <div className="text-center mb-8">
          <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-2">— SkyWatcher —</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            {t('auth.signup')}
          </h1>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full btn-ghost py-3 rounded-xl text-sm font-bold mb-6 flex items-center justify-center gap-2"
          style={{ borderColor: 'rgba(56,240,255,0.20)', color: 'var(--text-secondary)' }}
        >
          <GoogleIcon />
          {t('auth.loginWithGoogle')}
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: 'rgba(56,240,255,0.10)' }} />
          <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{t('auth.orDivider')}</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(56,240,255,0.10)' }} />
        </div>

        {success ? (
          <div className="text-center py-4">
            <p style={{ color: '#34d399' }} className="text-sm">{success}</p>
            <Link href="/login" className="btn-primary mt-4 inline-block px-6 py-3 rounded-xl text-sm font-bold">
              {t('auth.login')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" placeholder={t('auth.name')} value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
            <input type="email" placeholder={t('auth.email')} value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder={t('auth.password')} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
            <input type="password" placeholder={t('auth.confirmPassword')} value={confirm} onChange={e => setConfirm(e.target.value)} style={inputStyle} required />

            {error && <p className="text-xs text-center" style={{ color: '#f87171' }}>{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary py-3 rounded-xl text-sm font-bold mt-2">
              {loading ? t('auth.creatingAccount') : t('auth.signup')}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-xs" style={{ color: 'var(--text-dim)' }}>
          {t('auth.hasAccount')}{' '}
          <Link href="/login" style={{ color: '#38F0FF' }}>{t('auth.login')}</Link>
        </p>
      </div>
    </div>
  );
}
