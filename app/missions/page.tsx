'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { checkMissionAvailability, type MissionRequirements } from '@/lib/missions/availability';
import UploadModal from '@/components/UploadModal';

interface Mission {
  id: string;
  title_en: string;
  title_ka: string;
  description_en: string;
  description_ka: string;
  difficulty: 'easy' | 'medium' | 'hard';
  target_object: string;
  target_type: string;
  points_reward: number;
  xp_reward: number;
  reward_type: string | null;
  reward_description_en: string | null;
  reward_description_ka: string | null;
  required_conditions: MissionRequirements | null;
}

interface UserMissionStatus {
  mission_id: string;
  status: string;
  id: string;
}

const DIFFICULTY_COLOR = {
  easy: '#34d399',
  medium: '#FFD166',
  hard: '#f87171',
};

const TARGET_EMOJI: Record<string, string> = {
  moon: '🌙', full_moon: '🌕', earthshine: '🌙',
  jupiter: '🪐', jupiter_moons: '🪐', saturn: '🪐',
  venus: '⭐', mars: '🔴', mercury: '⚪',
  orion_nebula: '🌌', pleiades: '✨', andromeda: '🌌',
  meteor: '☄️', any_bright: '⭐',
};

export default function MissionsPage() {
  const { user, profile } = useAuth();
  const { t, locale } = useLanguage();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userStatuses, setUserStatuses] = useState<UserMissionStatus[]>([]);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [uploadMission, setUploadMission] = useState<{ mission: Mission; userMissionId: string } | null>(null);
  const [cloudCover, setCloudCover] = useState<number>(50);

  useEffect(() => {
    const supabase = createClient();

    supabase.from('missions').select('*').eq('is_active', true).then(({ data }) => {
      setMissions((data as Mission[]) ?? []);
      setLoading(false);
    });

    // Fetch weather
    fetch('https://api.open-meteo.com/v1/forecast?latitude=41.7151&longitude=44.8271&current=cloud_cover')
      .then(r => r.json())
      .then(d => setCloudCover(d?.current?.cloud_cover ?? 50))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!profile) return;
    const supabase = createClient();
    supabase
      .from('user_missions')
      .select('mission_id, status, id')
      .eq('user_id', profile.id)
      .then(({ data }) => setUserStatuses((data as UserMissionStatus[]) ?? []));
  }, [profile]);

  async function handleStart(missionId: string) {
    if (!user || !profile) return;
    setStartingId(missionId);
    const supabase = createClient();
    const { data } = await supabase
      .from('user_missions')
      .insert({ user_id: profile.id, mission_id: missionId, status: 'active' })
      .select('id')
      .single();
    if (data) {
      setUserStatuses(prev => [...prev, { mission_id: missionId, status: 'active', id: data.id }]);
    }
    setStartingId(null);
  }

  const filtered = filter === 'all' ? missions : missions.filter(m => m.difficulty === filter);

  const getUserStatus = (missionId: string) =>
    userStatuses.find(s => s.mission_id === missionId);

  const filterTabs: Array<'all' | 'easy' | 'medium' | 'hard'> = ['all', 'easy', 'medium', 'hard'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-page-enter">
      <div className="text-center mb-10">
        <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-2">— SkyWatcher —</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          {t('missions.title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
          {t('missions.subtitle')}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 justify-center mb-8 flex-wrap">
        {filterTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className="px-5 py-2 rounded-full text-xs font-bold transition-all duration-200"
            style={{
              background: filter === tab ? 'rgba(56,240,255,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${filter === tab ? 'rgba(56,240,255,0.40)' : 'rgba(255,255,255,0.08)'}`,
              color: filter === tab ? '#38F0FF' : 'var(--text-dim)',
            }}
          >
            {t(`missions.${tab}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 h-64 animate-pulse" style={{ borderColor: 'rgba(56,240,255,0.08)' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(mission => {
            const userStatus = getUserStatus(mission.id);
            const availability = checkMissionAvailability(
              mission.required_conditions,
              { cloudCover: cloudCover },
              [],
              mission.target_object,
            );
            const diffColor = DIFFICULTY_COLOR[mission.difficulty];
            const emoji = TARGET_EMOJI[mission.target_object] ?? '🔭';

            return (
              <div
                key={mission.id}
                className="glass-card p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  borderColor: userStatus?.status === 'verified'
                    ? 'rgba(52,211,153,0.30)'
                    : userStatus?.status === 'active'
                    ? 'rgba(56,240,255,0.30)'
                    : `rgba(${mission.difficulty === 'easy' ? '52,211,153' : mission.difficulty === 'medium' ? '255,209,102' : '248,113,113'},0.15)`,
                  boxShadow: userStatus?.status === 'active'
                    ? '0 0 20px rgba(56,240,255,0.08)'
                    : 'none',
                  opacity: userStatus?.status === 'verified' ? 0.8 : 1,
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl">{emoji}</span>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: `${diffColor}18`, color: diffColor }}
                  >
                    {t(`missions.${mission.difficulty}`)}
                  </span>
                </div>

                {/* Title & desc */}
                <div className="flex-1">
                  <h3 className="font-bold text-base leading-snug mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>
                    {locale === 'ka' ? mission.title_ka : mission.title_en}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {locale === 'ka' ? mission.description_ka : mission.description_en}
                  </p>
                </div>

                {/* Reward */}
                {mission.reward_description_en && (
                  <p className="text-[10px] px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(255,209,102,0.06)', color: '#FFD166' }}>
                    {locale === 'ka' ? mission.reward_description_ka : mission.reward_description_en}
                  </p>
                )}

                {/* Points */}
                <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--text-dim)' }}>
                  <span style={{ color: '#38F0FF' }}>{mission.points_reward} {t('missions.points')}</span>
                  <span>·</span>
                  <span style={{ color: '#a78bfa' }}>{mission.xp_reward} {t('missions.xp')}</span>
                </div>

                {/* Availability badge */}
                {!userStatus && (
                  <div
                    className="text-[10px] px-2.5 py-1 rounded-full text-center font-medium"
                    style={{
                      background: availability.available ? 'rgba(52,211,153,0.10)' : 'rgba(255,255,255,0.04)',
                      color: availability.available ? '#34d399' : 'var(--text-dim)',
                    }}
                  >
                    {t(availability.reasonKey)}
                  </div>
                )}

                {/* Action button */}
                {!user ? (
                  <button
                    className="btn-ghost py-2.5 rounded-xl text-xs font-bold text-center"
                    style={{ borderColor: 'rgba(56,240,255,0.15)', color: 'var(--text-dim)', opacity: 0.6 }}
                    onClick={() => window.location.href = '/login'}
                  >
                    {t('missions.loginToStart')}
                  </button>
                ) : userStatus?.status === 'verified' ? (
                  <div
                    className="py-2.5 rounded-xl text-xs font-bold text-center"
                    style={{ background: 'rgba(52,211,153,0.10)', color: '#34d399' }}
                  >
                    ✓ {t('missions.verified')}
                  </div>
                ) : userStatus?.status === 'submitted' ? (
                  <div
                    className="py-2.5 rounded-xl text-xs font-bold text-center animate-pulse"
                    style={{ background: 'rgba(56,240,255,0.08)', color: '#38F0FF' }}
                  >
                    {t('missions.verifying')}
                  </div>
                ) : userStatus?.status === 'active' ? (
                  <button
                    onClick={() => setUploadMission({ mission, userMissionId: userStatus.id })}
                    className="btn-primary py-2.5 rounded-xl text-xs font-bold text-center"
                  >
                    {t('missions.uploadPhoto')}
                  </button>
                ) : userStatus?.status === 'rejected' ? (
                  <button
                    onClick={() => setUploadMission({ mission, userMissionId: userStatus.id })}
                    className="btn-ghost py-2.5 rounded-xl text-xs font-bold"
                    style={{ borderColor: 'rgba(248,113,113,0.30)', color: '#f87171' }}
                  >
                    {t('missions.tryAgain')}
                  </button>
                ) : (
                  <button
                    onClick={() => handleStart(mission.id)}
                    disabled={startingId === mission.id}
                    className="btn-stellar py-2.5 rounded-xl text-xs font-bold"
                  >
                    {startingId === mission.id ? '...' : t('missions.startMission')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {uploadMission && (
        <UploadModal
          mission={uploadMission.mission}
          userMissionId={uploadMission.userMissionId}
          onClose={() => setUploadMission(null)}
          onSuccess={(status) => {
            setUserStatuses(prev =>
              prev.map(s => s.id === uploadMission.userMissionId ? { ...s, status } : s)
            );
            setUploadMission(null);
          }}
        />
      )}
    </div>
  );
}
