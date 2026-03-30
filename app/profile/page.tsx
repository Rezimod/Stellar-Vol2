'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import UserAvatar from '@/components/UserAvatar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getLevelTitle, getNextLevelXP, LEVEL_THRESHOLDS } from '@/lib/auth/types';

interface UserMission {
  id: string;
  status: string;
  missions: {
    title_en: string;
    title_ka: string;
    difficulty: string;
    points_reward: number;
  };
}

interface Reward {
  id: string;
  reward_type: string;
  reward_code: string;
  description_en: string;
  description_ka: string;
  is_redeemed: boolean;
  expires_at: string | null;
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { profile, signOut, user } = useAuth();
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    if (!profile) return;
    const supabase = createClient();

    supabase
      .from('user_missions')
      .select('id, status, missions(title_en, title_ka, difficulty, points_reward)')
      .eq('user_id', profile.id)
      .in('status', ['active', 'submitted', 'verified'])
      .then(({ data }) => setMissions((data as unknown as UserMission[]) ?? []));

    supabase
      .from('rewards')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setRewards((data as Reward[]) ?? []));
  }, [profile]);

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  if (!profile) return null;

  const levelTitle = getLevelTitle(profile.xp, locale as 'en' | 'ka');
  const nextLevelXP = getNextLevelXP(profile.xp);
  const currentThreshold = LEVEL_THRESHOLDS.find(th => th.level === profile.level);
  const xpProgress = currentThreshold && nextLevelXP > currentThreshold.xp
    ? ((profile.xp - currentThreshold.xp) / (nextLevelXP - currentThreshold.xp)) * 100
    : 0;

  const difficultyColor = (d: string) =>
    d === 'easy' ? '#34d399' : d === 'medium' ? '#FFD166' : '#f87171';

  const statusColor = (s: string) =>
    s === 'verified' ? '#34d399' : s === 'submitted' ? '#38F0FF' : 'var(--text-dim)';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8 animate-page-enter">
      <div className="text-center">
        <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-2">— SkyWatcher —</p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
          {t('profile.title')}
        </h1>
      </div>

      {/* Profile Card */}
      <div
        className="glass-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
        style={{ borderColor: 'rgba(56,240,255,0.20)', boxShadow: '0 0 40px rgba(56,240,255,0.08)' }}
      >
        <UserAvatar name={profile.full_name} size="lg" />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            {profile.full_name}
          </h2>
          <p className="text-sm mb-1" style={{ color: '#38F0FF' }}>{levelTitle}</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>{user?.email}</p>

          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: t('profile.level'), value: profile.level },
              { label: t('profile.xp'), value: profile.xp },
              { label: t('profile.points'), value: profile.total_points },
              { label: t('profile.missionsCompleted'), value: profile.missions_completed },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold" style={{ color: '#38F0FF', fontFamily: 'Georgia, serif' }}>
                  {stat.value}
                </p>
                <p className="text-[9px] uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
              <span>{profile.xp} XP</span>
              <span>{nextLevelXP} XP</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(56,240,255,0.10)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, xpProgress))}%`,
                  background: 'linear-gradient(90deg, #38F0FF, #7a5fff)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Missions */}
      <div>
        <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#FFD166' }}>
          {t('profile.activeMissions')}
        </h3>
        {missions.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{t('profile.noActiveMissions')}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {missions.map(m => (
              <div
                key={m.id}
                className="glass-card p-4 flex items-center justify-between"
                style={{ borderColor: 'rgba(255,209,102,0.15)' }}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {locale === 'ka' ? m.missions.title_ka : m.missions.title_en}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: difficultyColor(m.missions.difficulty) }}>
                    {t(`missions.${m.missions.difficulty}`)} · {m.missions.points_reward} {t('missions.points')}
                  </p>
                </div>
                <span className="text-xs font-bold capitalize" style={{ color: statusColor(m.status) }}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rewards */}
      <div id="rewards">
        <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#a78bfa' }}>
          {t('profile.myRewards')}
        </h3>
        {rewards.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{t('profile.noRewards')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewards.map(r => (
              <div
                key={r.id}
                className="glass-card p-5"
                style={{
                  borderColor: r.is_redeemed ? 'rgba(255,255,255,0.05)' : 'rgba(122,95,255,0.25)',
                  opacity: r.is_redeemed ? 0.6 : 1,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-bold" style={{ color: r.is_redeemed ? 'var(--text-dim)' : '#a78bfa' }}>
                    {locale === 'ka' ? r.description_ka : r.description_en}
                  </p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                    style={{
                      background: r.is_redeemed ? 'rgba(255,255,255,0.05)' : 'rgba(122,95,255,0.15)',
                      color: r.is_redeemed ? 'var(--text-dim)' : '#a78bfa',
                    }}
                  >
                    {r.is_redeemed ? t('profile.redeemed') : t('profile.available')}
                  </span>
                </div>
                <div
                  className="font-mono text-lg font-bold tracking-widest mt-3 p-2 rounded-lg text-center"
                  style={{
                    background: 'rgba(122,95,255,0.08)',
                    border: '1px solid rgba(122,95,255,0.15)',
                    color: '#a78bfa',
                  }}
                >
                  {r.reward_code}
                </div>
                {r.expires_at && !r.is_redeemed && (
                  <p className="text-[10px] mt-2 text-center" style={{ color: 'var(--text-dim)' }}>
                    {t('profile.expiresIn')}{' '}
                    {Math.ceil((new Date(r.expires_at).getTime() - Date.now()) / 86400000)}{' '}
                    {t('profile.days')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={handleSignOut}
          className="btn-ghost px-8 py-3 rounded-xl text-sm font-bold"
          style={{ borderColor: 'rgba(248,113,113,0.30)', color: '#f87171' }}
        >
          {t('profile.logout')}
        </button>
      </div>
    </div>
  );
}
