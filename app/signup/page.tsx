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

export default function SignupPage() {
  const { signUp, signIn } = useAuth();
  const { locale } = useLanguage();
  const router = useRouter();
  const ka = locale === 'ka';

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
    setSuccess('');
    if (password !== confirm) {
      setError(ka ? 'პაროლები არ ემთხვევა' : 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError(ka ? 'პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს' : 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { error: signUpError } = await signUp(email, password, name);
      if (signUpError) {
        if (signUpError.includes('already registered') || signUpError.includes('already exists') || signUpError.includes('already been registered')) {
          setError(ka ? 'ეს ელ.ფოსტა უკვე დარეგისტრირებულია. სცადე შესვლა.' : 'This email is already registered. Try logging in.');
        } else if (signUpError.includes('not configured') || signUpError.includes('your-project')) {
          setError(ka ? 'Supabase კონფიგურაცია არ არის. დაამატე env vars Vercel-ში.' : 'Supabase not configured. Add env vars to Vercel.');
        } else if (signUpError.includes('fetch') || signUpError.includes('Failed') || signUpError.includes('network')) {
          setError(ka ? 'კავშირის შეცდომა. Supabase პროექტი შეიძლება გათიშულია (free tier pauses after inactivity).' : 'Connection error. Supabase project may be paused (free tier pauses after inactivity).');
        } else {
          setError(signUpError);
        }
        return;
      }

      const { error: signInError } = await signIn(email, password);
      if (!signInError) {
        router.push('/missions');
      } else {
        setSuccess(ka
          ? 'ანგარიში შეიქმნა! შეამოწმე ელ.ფოსტა დასადასტურებლად, შემდეგ შედი.'
          : 'Account created! Check your email to confirm, then log in.');
      }
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
            {ka ? 'რეგისტრაცია' : 'Create Account'}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder={ka ? 'სრული სახელი' : 'Full name'} value={name}
            onChange={e => setName(e.target.value)} style={inputStyle} required autoComplete="name" />
          <input type="email" placeholder={ka ? 'ელ.ფოსტა' : 'Email'} value={email}
            onChange={e => setEmail(e.target.value)} style={inputStyle} required autoComplete="email" />
          <input type="password" placeholder={ka ? 'პაროლი (მინ. 6 სიმბოლო)' : 'Password (min. 6 chars)'} value={password}
            onChange={e => setPassword(e.target.value)} style={inputStyle} required minLength={6} autoComplete="new-password" />
          <input type="password" placeholder={ka ? 'გაიმეორე პაროლი' : 'Confirm password'} value={confirm}
            onChange={e => setConfirm(e.target.value)} style={inputStyle} required autoComplete="new-password" />

          {error && (
            <div className="rounded-xl p-3 text-sm leading-snug" style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.30)', color: '#f87171' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl p-3 text-sm leading-snug" style={{ background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.30)', color: '#34d399' }}>
              {success}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary py-3 rounded-xl text-sm font-bold mt-2">
            {loading ? (ka ? 'ანგარიშის შექმნა...' : 'Creating account...') : (ka ? 'რეგისტრაცია' : 'Create Account')}
          </button>
        </form>
        <p className="text-center mt-6 text-xs" style={{ color: 'var(--text-dim)' }}>
          {ka ? 'უკვე გაქვს ანგარიში?' : 'Already have an account?'}{' '}
          <Link href="/login" style={{ color: '#38F0FF' }}>{ka ? 'შესვლა' : 'Log In'}</Link>
        </p>
      </div>
    </div>
  );
}
