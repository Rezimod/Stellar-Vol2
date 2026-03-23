'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ChevronRight, ChevronLeft, Loader2, Check, Sparkles } from 'lucide-react';
import type { CreateStep } from '@/lib/types';

interface FormData {
  starName: string;
  ownerName: string;
  dedicatedTo: string;
  occasionDate: string;
  message: string;
}

const STEPS: CreateStep[] = ['name', 'date', 'message', 'preview', 'generate'];

const stepLabels: Record<CreateStep, string> = {
  name:     'Star Name',
  date:     'Occasion',
  message:  'Message',
  preview:  'Preview',
  generate: 'Generate',
};

function ProgressBar({ current }: { current: CreateStep }) {
  const idx = STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-1.5 justify-center mb-8">
      {STEPS.filter(s => s !== 'generate').map((step, i) => {
        const done   = i < idx;
        const active = step === current;
        return (
          <div key={step} className="flex items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                done   ? 'step-done'     :
                active ? 'step-active'   : 'step-inactive'
              }`}
            >
              {done ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-[10px] hidden sm:block transition-colors ${active ? 'text-[#FFD166]' : 'text-[var(--text-dim)]'}`}>
              {stepLabels[step]}
            </span>
            {i < STEPS.length - 2 && (
              <div className={`w-6 sm:w-10 h-px transition-colors ${done ? 'bg-[#34d399]/40' : 'bg-white/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep]       = useState<CreateStep>('name');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [form, setForm]       = useState<FormData>({
    starName: '', ownerName: '', dedicatedTo: '', occasionDate: '', message: '',
  });

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const canNext = () => {
    if (step === 'name')    return form.starName.trim() && form.ownerName.trim() && form.dedicatedTo.trim();
    if (step === 'date')    return form.occasionDate.trim();
    if (step === 'message') return form.message.trim().length >= 10;
    return true;
  };

  const next = () => {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
  };
  const back = () => {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stars/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed');
      const { id } = await res.json();
      router.push(`/star/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-page-enter">

      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <Star size={18} style={{ color: '#FFD166' }} />
          <span className="text-xs font-mono tracking-widest text-[var(--text-dim)] uppercase">Name a Star</span>
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Create Your <span style={{ color: '#FFD166' }}>Star</span>
        </h1>
      </div>

      <ProgressBar current={step} />

      {/* Step card */}
      <div className="glass-card p-6 sm:p-8 min-h-[320px] flex flex-col">

        {/* ── STEP: name ── */}
        {step === 'name' && (
          <div className="flex flex-col gap-5 flex-1">
            <h2 className="text-lg font-semibold text-white">What would you like to name your star?</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[var(--text-dim)] uppercase tracking-widest">Star Name *</label>
              <input
                value={form.starName}
                onChange={set('starName')}
                placeholder="e.g. Elena, Hope, Forever..."
                maxLength={40}
                className="w-full bg-[rgba(15,31,61,0.6)] border border-[rgba(56,240,255,0.12)] focus:border-[rgba(56,240,255,0.35)] rounded-xl px-4 py-3 text-white outline-none placeholder:text-[var(--text-dim)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[var(--text-dim)] uppercase tracking-widest">Your Name *</label>
              <input
                value={form.ownerName}
                onChange={set('ownerName')}
                placeholder="The star will be named by..."
                maxLength={60}
                className="w-full bg-[rgba(15,31,61,0.6)] border border-[rgba(56,240,255,0.12)] focus:border-[rgba(56,240,255,0.35)] rounded-xl px-4 py-3 text-white outline-none placeholder:text-[var(--text-dim)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[var(--text-dim)] uppercase tracking-widest">Dedicated To *</label>
              <input
                value={form.dedicatedTo}
                onChange={set('dedicatedTo')}
                placeholder="Who is this star for?"
                maxLength={80}
                className="w-full bg-[rgba(15,31,61,0.6)] border border-[rgba(56,240,255,0.12)] focus:border-[rgba(56,240,255,0.35)] rounded-xl px-4 py-3 text-white outline-none placeholder:text-[var(--text-dim)] transition-colors"
              />
            </div>
          </div>
        )}

        {/* ── STEP: date ── */}
        {step === 'date' && (
          <div className="flex flex-col gap-5 flex-1">
            <h2 className="text-lg font-semibold text-white">What is the occasion?</h2>
            <p className="text-[var(--text-secondary)] text-sm -mt-2">
              This date will be engraved on your star certificate.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[var(--text-dim)] uppercase tracking-widest">Date *</label>
              <input
                type="date"
                value={form.occasionDate}
                onChange={set('occasionDate')}
                className="w-full bg-[rgba(15,31,61,0.6)] border border-[rgba(56,240,255,0.12)] focus:border-[rgba(56,240,255,0.35)] rounded-xl px-4 py-3 text-white outline-none transition-colors"
                style={{ colorScheme: 'dark' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Birthday', 'Anniversary', 'Memorial', 'New Baby', 'Graduation', 'Just Because'].map(occ => (
                <button
                  key={occ}
                  onClick={() => {
                    if (!form.occasionDate) {
                      setForm(f => ({ ...f, occasionDate: new Date().toISOString().split('T')[0] }));
                    }
                  }}
                  className="text-xs py-2 px-3 rounded-lg border border-[rgba(255,209,102,0.12)] text-[var(--text-secondary)] hover:border-[rgba(255,209,102,0.3)] hover:text-[#FFD166] transition-all text-left"
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: message ── */}
        {step === 'message' && (
          <div className="flex flex-col gap-5 flex-1">
            <h2 className="text-lg font-semibold text-white">Write a message</h2>
            <p className="text-[var(--text-secondary)] text-sm -mt-2">
              This will be stored on the Stellar blockchain alongside your star.
            </p>

            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs text-[var(--text-dim)] uppercase tracking-widest">
                Message * <span className="text-[var(--text-dim)]">({form.message.length}/280)</span>
              </label>
              <textarea
                value={form.message}
                onChange={set('message')}
                placeholder="Write something meaningful..."
                maxLength={280}
                rows={5}
                className="w-full flex-1 bg-[rgba(15,31,61,0.6)] border border-[rgba(56,240,255,0.12)] focus:border-[rgba(56,240,255,0.35)] rounded-xl px-4 py-3 text-white outline-none placeholder:text-[var(--text-dim)] resize-none transition-colors leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ── STEP: preview ── */}
        {step === 'preview' && (
          <div className="flex flex-col gap-4 flex-1">
            <h2 className="text-lg font-semibold text-white">Preview your certificate</h2>

            {/* Mini certificate */}
            <div className="certificate-card p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[var(--text-dim)] tracking-widest uppercase">
                  Astroman Stellar · Certificate
                </span>
                <Star size={14} style={{ color: '#FFD166' }} />
              </div>

              <div className="ornament-line" />

              <p
                className="text-2xl font-bold text-center"
                style={{ fontFamily: 'Georgia, serif', color: '#FFD166' }}
              >
                ✦ {form.starName}
              </p>
              <p className="text-center text-[var(--text-secondary)] text-sm">
                Dedicated to <span className="text-white font-medium">{form.dedicatedTo}</span>
              </p>
              <p className="text-center text-[var(--text-dim)] text-xs">{form.occasionDate}</p>

              <div className="ornament-line" />

              <p className="text-center text-[var(--text-secondary)] text-xs italic leading-relaxed">
                "{form.message}"
              </p>

              <div className="flex justify-center mt-1">
                <span className="text-[9px] font-mono text-[var(--text-dim)] bg-[rgba(56,240,255,0.05)] px-3 py-1 rounded-full border border-[rgba(56,240,255,0.08)]">
                  Blockchain hash: pending...
                </span>
              </div>
            </div>

            <p className="text-[var(--text-secondary)] text-xs text-center">
              Looks good? Click "Generate Star" to seal it on the Stellar blockchain.
            </p>
          </div>
        )}

        {/* ── STEP: generate ── */}
        {step === 'generate' && (
          <div className="flex flex-col items-center justify-center flex-1 gap-5 py-6">
            {loading ? (
              <>
                <div className="relative">
                  <Loader2 size={48} className="animate-spin" style={{ color: '#7A5FFF' }} />
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: '0 0 30px rgba(122,95,255,0.4)', animation: 'pulse-ring 1.5s ease-out infinite' }}
                  />
                </div>
                <p className="text-[var(--text-secondary)] text-sm text-center">
                  Generating star coordinates and submitting to Stellar testnet...
                </p>
              </>
            ) : error ? (
              <div className="text-center flex flex-col gap-3">
                <p className="text-red-400 text-sm">{error}</p>
                <button onClick={handleGenerate} className="btn-ghost px-5 py-2 rounded-xl text-sm">
                  Retry
                </button>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center gap-4">
                <Sparkles size={48} style={{ color: '#FFD166' }} className="animate-float" />
                <p className="text-white font-semibold">Ready to mint your star!</p>
                <p className="text-[var(--text-secondary)] text-sm max-w-xs">
                  Your star will be assigned real astronomical coordinates and sealed on the Stellar testnet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
          {STEPS.indexOf(step) > 0 ? (
            <button
              onClick={back}
              disabled={loading}
              className="btn-ghost px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          ) : <div />}

          {step !== 'generate' ? (
            <button
              onClick={next}
              disabled={!canNext()}
              className="btn-stellar px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 'preview' ? 'Looks Great!' : 'Continue'}
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Star size={16} />
              Generate Star
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
