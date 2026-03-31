'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0,    title_en: 'Beginner Observer',  title_ka: 'დამწყები დამკვირვებელი' },
  { level: 2, xp: 100,  title_en: 'Night Explorer',     title_ka: 'ღამის მკვლევარი' },
  { level: 3, xp: 250,  title_en: 'Star Gazer',         title_ka: 'ვარსკვლავთმრიცხველი' },
  { level: 4, xp: 500,  title_en: 'Sky Hunter',         title_ka: 'ცის მონადირე' },
  { level: 5, xp: 1000, title_en: 'Cosmic Master',      title_ka: 'კოსმოსის ოსტატი' },
  { level: 6, xp: 2000, title_en: 'Galaxy Legend',      title_ka: 'გალაქტიკის ლეგენდა' },
];

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function ProfileContent() {
  const { user, profile, signOut } = useAuth();
  const { locale } = useLanguage();
  const router = useRouter();
  const ka = locale === 'ka';

  const displayName: string =
    profile?.full_name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Observer';

  const level = profile?.level ?? 1;
  const xp = profile?.xp ?? 0;
  const points = profile?.total_points ?? 0;
  const missionsCompleted = profile?.missions_completed ?? 0;

  const levelInfo = [...LEVEL_THRESHOLDS].reverse().find(t => xp >= t.xp) ?? LEVEL_THRESHOLDS[0];
  const nextLevel = LEVEL_THRESHOLDS.find(t => t.xp > xp);
  const xpProgress = nextLevel
    ? Math.round(((xp - levelInfo.xp) / (nextLevel.xp - levelInfo.xp)) * 100)
    : 100;

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  const stats = [
    { label: ka ? 'დონე' : 'Level', value: level, color: '#FFD166' },
    { label: 'XP', value: xp, color: '#38F0FF' },
    { label: ka ? 'ქულა' : 'Points', value: points, color: '#a78bfa' },
    { label: ka ? 'მისიები' : 'Missions', value: missionsCompleted, color: '#34d399' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-5 animate-page-enter">

      {/* Header */}
      <div className="text-center mb-2">
        <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-2">— SkyWatcher —</p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
          {ka ? 'ჩემი პროფილი' : 'My Profile'}
        </h1>
      </div>

      {/* Profile card */}
      <div
        className="rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: 'rgba(15,31,61,0.60)',
          border: '1px solid rgba(56,240,255,0.18)',
          boxShadow: '0 0 40px rgba(56,240,255,0.06)',
        }}
      >
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(56,240,255,0.20), rgba(122,95,255,0.20))',
              border: '2px solid rgba(56,240,255,0.35)',
              color: '#38F0FF',
            }}
          >
            {getInitials(displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate" style={{ fontFamily: 'Georgia, serif' }}>
              {displayName}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#38F0FF' }}>
              {ka ? levelInfo.title_ka : levelInfo.title_en}
            </p>
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-dim)' }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-4 gap-2 py-4 rounded-xl"
          style={{ background: 'rgba(0,0,0,0.20)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-bold" style={{ color: s.color, fontFamily: 'Georgia, serif' }}>
                {s.value}
              </p>
              <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-dim)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* XP bar */}
        <div>
          <div className="flex justify-between text-[11px] mb-1.5" style={{ color: 'var(--text-dim)' }}>
            <span>{xp} XP</span>
            <span>
              {nextLevel
                ? `${nextLevel.xp} XP ${ka ? 'შემდეგ დონემდე' : 'next level'}`
                : (ka ? 'მაქსიმუმი' : 'Max level')}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(56,240,255,0.08)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, Math.max(2, xpProgress))}%`,
                background: 'linear-gradient(90deg, #38F0FF, #7a5fff)',
                boxShadow: '0 0 8px rgba(56,240,255,0.4)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Missions section */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(15,31,61,0.40)', border: '1px solid rgba(255,209,102,0.14)' }}
      >
        <h3 className="text-sm font-bold mb-2" style={{ color: '#FFD166', fontFamily: 'Georgia, serif' }}>
          {ka ? 'ჩემი მისიები' : 'My Missions'}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {ka
            ? 'ციური მისიების ტრეკინგი მალე დაემატება. ახლა შეგიძლია ხელმისაწვდომი ობიექტები ნახო.'
            : 'Mission tracking is coming soon. Browse available sky targets now.'}
        </p>
        <button
          onClick={() => router.push('/missions')}
          className="mt-3 text-xs px-4 py-2 rounded-xl font-bold transition-all"
          style={{
            background: 'rgba(255,209,102,0.10)',
            border: '1px solid rgba(255,209,102,0.25)',
            color: '#FFD166',
          }}
        >
          {ka ? 'მისიების ნახვა →' : 'Browse Missions →'}
        </button>
      </div>

      {/* Rewards section */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(15,31,61,0.40)', border: '1px solid rgba(122,95,255,0.14)' }}
      >
        <h3 className="text-sm font-bold mb-2" style={{ color: '#a78bfa', fontFamily: 'Georgia, serif' }}>
          {ka ? 'ჩემი ჯილდოები' : 'My Rewards'}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {ka
            ? 'ჯილდოების სისტემა მალე გამოჩნდება. მისიების შესრულებით მიიღებ XP-ს და სპეციალურ ქულებს.'
            : 'Reward system coming soon. Complete missions to earn XP and special rewards.'}
        </p>
      </div>

      {/* Sign out */}
      <div className="flex justify-center py-2">
        <button
          onClick={handleSignOut}
          className="px-8 py-3 rounded-xl text-sm font-bold transition-all"
          style={{
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.25)',
            color: '#f87171',
          }}
        >
          {ka ? 'გასვლა' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}
