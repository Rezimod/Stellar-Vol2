'use client';

import { useState, useRef } from 'react';
import { X, Camera, Upload, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/context';

interface Mission {
  id: string;
  title_en: string;
  title_ka: string;
  target_object: string;
  difficulty: string;
}

interface VerificationResult {
  verified: boolean;
  confidence: number;
  scores: { authenticity: number; object_match: number; consistency: number; effort: number };
  analysis: string;
  rejection_reason: string | null;
  tips: string;
  reward_code: string | null;
  points_earned: number;
  xp_earned: number;
}

interface UploadModalProps {
  mission: Mission;
  userMissionId: string;
  onClose: () => void;
  onSuccess: (status: string) => void;
}

export default function UploadModal({ mission, userMissionId, onClose, onSuccess }: UploadModalProps) {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'verifying' | 'result'>('select');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit() {
    if (!file || !user) return;
    setPhase('verifying');

    try {
      const supabase = createClient();

      // Upload to Supabase storage
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `observations/${user.id}/${userMissionId}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('observations')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('observations').getPublicUrl(path);

      // Fetch weather snapshot
      let weatherSnapshot = {};
      try {
        const wr = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.7151&longitude=44.8271&current=cloudcover,temperature_2m');
        const wd = await wr.json();
        weatherSnapshot = wd.current ?? {};
      } catch {}

      // Update mission record with photo
      await supabase
        .from('user_missions')
        .update({
          photo_url: publicUrl,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          photo_metadata: { file_size: file.size, file_name: file.name },
          weather_at_submission: weatherSnapshot,
        })
        .eq('id', userMissionId);

      // Call AI verification
      const verifyRes = await fetch('/api/verify-observation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mission_id: mission.id,
          user_mission_id: userMissionId,
          photo_url: publicUrl,
          weather_snapshot: weatherSnapshot,
          sky_data_snapshot: {},
        }),
      });

      const verifyData: VerificationResult = await verifyRes.json();
      setResult(verifyData);
      setPhase('result');
      onSuccess(verifyData.verified ? 'verified' : 'rejected');
    } catch (err) {
      console.error('Upload error:', err);
      setPhase('select');
    }
  }

  const ScoreBar = ({ label, value }: { label: string; value: number }) => (
    <div>
      <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--text-dim)' }}>
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value * 100}%`,
            background: value >= 0.7 ? '#34d399' : value >= 0.4 ? '#FFD166' : '#f87171',
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div
        className="glass-card p-6 w-full max-w-md relative"
        style={{ borderColor: 'rgba(56,240,255,0.25)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5"
          style={{ color: 'var(--text-dim)' }}
        >
          <X size={18} />
        </button>

        {phase === 'select' && (
          <>
            <div className="mb-6">
              <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-1">
                {t('missions.uploadPhoto')}
              </p>
              <h2 className="text-lg font-bold" style={{ fontFamily: 'Georgia, serif' }}>
                {locale === 'ka' ? mission.title_ka : mission.title_en}
              </h2>
            </div>

            {preview ? (
              <div className="mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: '240px' }}
                />
                <button
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="text-xs mt-2 block mx-auto"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {t('missions.selectPhoto')}
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center mb-4 cursor-pointer hover:bg-white/3 transition-colors"
                style={{ borderColor: 'rgba(56,240,255,0.15)' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={32} className="mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('missions.selectPhoto')}</p>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="btn-ghost py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                style={{ borderColor: 'rgba(56,240,255,0.20)', color: 'var(--text-secondary)' }}
              >
                <Camera size={15} />
                {t('missions.takePhoto')}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-ghost py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                style={{ borderColor: 'rgba(56,240,255,0.20)', color: 'var(--text-secondary)' }}
              >
                <Upload size={15} />
                {t('missions.uploadFromGallery')}
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!file}
              className="btn-primary w-full py-3 rounded-xl text-sm font-bold"
              style={{ opacity: !file ? 0.4 : 1 }}
            >
              {t('missions.submitVerification')}
            </button>
          </>
        )}

        {phase === 'verifying' && (
          <div className="text-center py-10">
            <Loader2 size={40} className="mx-auto mb-4 animate-spin" style={{ color: '#38F0FF' }} />
            <p className="text-sm font-medium mb-1">{t('missions.verifying')}</p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {t('missions.submittingObservation')}
            </p>
          </div>
        )}

        {phase === 'result' && result && (
          <>
            {result.verified ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">✨</div>
                  <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif', color: '#34d399' }}>
                    {t('missions.observationVerified')}
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{result.analysis}</p>
                </div>

                {/* Scores */}
                <div className="flex flex-col gap-2 mb-5">
                  <ScoreBar label="Authenticity" value={result.scores.authenticity} />
                  <ScoreBar label="Object Match" value={result.scores.object_match} />
                  <ScoreBar label="Consistency" value={result.scores.consistency} />
                  <ScoreBar label="Effort" value={result.scores.effort} />
                </div>

                {/* Reward */}
                {result.reward_code && (
                  <div
                    className="rounded-xl p-4 mb-4 text-center"
                    style={{ background: 'rgba(122,95,255,0.08)', border: '1px solid rgba(122,95,255,0.20)' }}
                  >
                    <p className="text-xs mb-2" style={{ color: 'var(--text-dim)' }}>{t('missions.youEarned')}</p>
                    <p className="font-mono text-xl font-bold tracking-widest" style={{ color: '#a78bfa' }}>
                      {result.reward_code}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 text-xs justify-center mb-4">
                  <span style={{ color: '#38F0FF' }}>+{result.points_earned} {t('missions.points')}</span>
                  <span style={{ color: 'var(--text-dim)' }}>·</span>
                  <span style={{ color: '#a78bfa' }}>+{result.xp_earned} {t('missions.xp')}</span>
                </div>

                <button onClick={onClose} className="btn-primary w-full py-3 rounded-xl text-sm font-bold">
                  {t('missions.viewMyRewards')}
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">🔭</div>
                  <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif', color: '#f87171' }}>
                    {t('missions.notVerifiedThisTime')}
                  </h2>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {result.rejection_reason}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                    💡 {result.tips}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPhase('select')}
                    className="btn-primary flex-1 py-3 rounded-xl text-sm font-bold"
                  >
                    {t('missions.tryAgain')}
                  </button>
                  <button
                    onClick={onClose}
                    className="btn-ghost flex-1 py-3 rounded-xl text-sm font-bold"
                    style={{ borderColor: 'rgba(255,255,255,0.10)', color: 'var(--text-dim)' }}
                  >
                    {t('common.close')}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
