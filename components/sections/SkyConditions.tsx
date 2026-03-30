import { getWeatherData, getCloudLabel, getSeeingLabel } from '@/lib/weather';
import { getMoonInfo } from '@/lib/astronomy';
import Link from 'next/link';

export default async function SkyConditions() {
  let cloudCover = 0;
  let temperature = 0;
  let seeing = 'Unknown';
  let windSpeed = 0;
  let humidity = 0;
  let moonPhase = 'Unknown';
  let moonIllum = 0;
  let moonRise = '—';
  let moonSet = '—';

  try {
    const [weather, moon] = await Promise.all([
      getWeatherData(),
      Promise.resolve(getMoonInfo(new Date())),
    ]);
    cloudCover = weather.current.cloudCover;
    temperature = weather.current.temperature;
    windSpeed = weather.current.windSpeed;
    humidity = weather.current.humidity;
    seeing = getSeeingLabel(weather.current);
    moonPhase = moon.phaseName;
    moonIllum = moon.illumination;
    moonRise = moon.riseTime ?? '—';
    moonSet = moon.setTime ?? '—';
  } catch {
    // fallback gracefully
  }

  const cloudLabel = getCloudLabel(cloudCover);
  const seeingColor = seeing === 'Excellent' ? '#34d399' : seeing === 'Good' ? '#38F0FF' : seeing === 'Fair' ? '#FFD166' : '#f87171';

  const MOON_EMOJIS: Record<string, string> = {
    'New Moon': '🌑', 'Waxing Crescent': '🌒', 'First Quarter': '🌓',
    'Waxing Gibbous': '🌔', 'Full Moon': '🌕', 'Waning Gibbous': '🌖',
    'Last Quarter': '🌗', 'Waning Crescent': '🌘',
  };
  const moonEmoji = MOON_EMOJIS[moonPhase] ?? '🌙';

  const cards = [
    {
      accent: 'cyan' as const,
      label: 'Cloud Cover',
      content: (
        <>
          <p className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#38F0FF' }}>{cloudCover}%</p>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{cloudLabel}</p>
          <p className="text-xs text-[var(--text-dim)] mt-1">{temperature}°C</p>
          {/* Bar */}
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full" style={{ width: `${cloudCover}%`, background: '#38F0FF', opacity: 0.7 }} />
          </div>
        </>
      ),
    },
    {
      accent: 'purple' as const,
      label: 'Astronomical Seeing',
      content: (
        <>
          <p className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif', color: seeingColor }}>{seeing}</p>
          <p className="text-xs text-[var(--text-dim)] mt-1.5">Wind {windSpeed} km/h · Humidity {humidity}%</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {seeing === 'Excellent' || seeing === 'Good'
              ? 'Great conditions for deep sky'
              : 'Planetary only or stay in'}
          </p>
        </>
      ),
    },
    {
      accent: 'gold' as const,
      label: 'Moon Phase',
      content: (
        <>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{moonEmoji}</span>
            <div>
              <p className="font-bold" style={{ fontFamily: 'Georgia, serif', color: '#FFD166' }}>{moonPhase}</p>
              <p className="text-xs text-[var(--text-secondary)]">{moonIllum}% illuminated</p>
            </div>
          </div>
          <div className="flex gap-4 mt-2 text-xs text-[var(--text-dim)]">
            <span>Rise <strong style={{ color: '#FFD166' }}>{moonRise}</strong></span>
            <span>Set <strong style={{ color: '#7A5FFF' }}>{moonSet}</strong></span>
          </div>
        </>
      ),
    },
  ];

  const accentMap = {
    cyan:   { border: 'rgba(56,240,255,0.2)',   glow: 'rgba(56,240,255,0.08)',   text: '#38F0FF' },
    purple: { border: 'rgba(122,95,255,0.2)',    glow: 'rgba(122,95,255,0.08)',  text: '#a78bfa' },
    gold:   { border: 'rgba(255,209,102,0.25)',  glow: 'rgba(255,209,102,0.08)', text: '#FFD166' },
  };

  return (
    <section className="w-full">
      <p className="text-center text-[var(--text-dim)] text-xs mb-2 tracking-widest uppercase">— Live Sky Conditions —</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        Current Sky at{' '}
        <span style={{ color: '#38F0FF' }}>Tbilisi</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(c => {
          const a = accentMap[c.accent];
          return (
            <div
              key={c.label}
              className="glass-card p-5 flex flex-col gap-3"
              style={{ borderColor: a.border, boxShadow: `0 4px 24px ${a.glow}` }}
            >
              <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase">{c.label}</p>
              {c.content}
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-5">
        <Link href="/sky-now" className="btn-ghost px-5 py-2.5 rounded-xl text-xs font-medium">
          Full Dashboard →
        </Link>
      </div>
    </section>
  );
}
