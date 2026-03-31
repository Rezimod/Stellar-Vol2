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
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ka = locale === 'ka';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        // Translate common Supabase error messages
        if (authError.includes('Invalid login credentials')) {
          setError(ka ? 'არასწორი ელ.ფოსტა ან პაროლი' : 'Invalid email or password');
        } else if (authError.includes('Email not confirmed')) {
          setError(ka ? 'ელ.ფოსტა არ არის დადასტურებული. შეამოწმე Supabase Dashboard → Auth → Providers → Email → გამორთე "Confirm email"' : 'Email not confirmed. Disable email confirmation in Supabase Dashboard.');
        } else if (authError.includes('not configured') || authError.includes('your-project')) {
          setError(ka ? 'Supabase კონფიგურაცია არ არის. დაამატე NEXT_PUBLIC_SUPABASE_URL და NEXT_PUBLIC_SUPABASE_ANON_KEY Vercel-ში.' : 'Supabase not configured. Add env vars to Vercel.');
        } else if (authError.includes('fetch') || authError.includes('network') || authError.includes('Failed')) {
          setError(ka ? 'კავშირის შეცდომა. შეამოწმე Supabase Dashboard — პროექტი შეიძლება გათიშულია (free tier pauses).' : 'Connection error. Check Supabase Dashboard — free tier projects pause after inactivity.');
        } else {
          setError(authError);
        }
        return;
      }
      router.push('/missions');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : (ka ? 'კავშირის შეცდომა' : 'Connection error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-md" style={{ borderColor: 'rgba(56,240,255,0.20)' }}>
        <div className="text-center mb-8">
          <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-2">— SkyWatcher —</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            {ka ? 'შესვლა' : 'Log In'}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" placeholder={ka ? 'ელ.ფოსტა' : 'Email'} value={email}
            onChange={e => setEmail(e.target.value)} style={inputStyle} required autoComplete="email" />
          <input type="password" placeholder={ka ? 'პაროლი' : 'Password'} value={password}
            onChange={e => setPassword(e.target.value)} style={inputStyle} required autoComplete="current-password" />

          {error && (
            <div className="rounded-xl p-3 text-sm leading-snug" style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.30)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary py-3 rounded-xl text-sm font-bold mt-2">
            {loading ? (ka ? 'შესვლა...' : 'Logging in...') : (ka ? 'შესვლა' : 'Log In')}
          </button>
        </form>
        <p className="text-center mt-6 text-xs" style={{ color: 'var(--text-dim)' }}>
          {ka ? 'ანგარიში არ გაქვს?' : "Don't have an account?"}{' '}
          <Link href="/signup" style={{ color: '#38F0FF' }}>{ka ? 'რეგისტრაცია' : 'Sign Up'}</Link>
        </p>
      </div>
    </div>
  );
}
