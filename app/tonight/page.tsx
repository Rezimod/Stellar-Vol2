import { getAllPlanets, getMoonInfo, getSunTimes, getDeepSkyObjects } from '@/lib/astronomy';
import type { PlanetInfo, MoonInfo, SunTimes, DeepSkyObject } from '@/lib/astronomy';
import { PLANETS } from '@/lib/planets-data';

const PLANET_DESCRIPTIONS: Record<string, string> = {
  Mercury: 'Look low on the horizon just after sunset or before sunrise. Binoculars help in twilight.',
  Venus:   'The brilliant "Evening Star" or "Morning Star" — unmistakably bright, often mistaken for a plane.',
  Mars:    'Recognizable by its distinct reddish hue. In a telescope, look for polar ice caps and surface markings.',
  Jupiter: 'Bright and steady. Even small binoculars reveal its four Galilean moons lined up on each side.',
  Saturn:  'Its rings are visible in almost any telescope — one of the most breathtaking sights in the sky.',
  Uranus:  'Faint blue-green disk, best seen in a telescope. Appears stellar to the naked eye on very dark nights.',
  Neptune: 'Requires a telescope. A tiny blue-gray disk, nearly impossible to distinguish from stars by color alone.',
};

function MoonPhaseEmoji({ phaseName }: { phaseName: string }) {
  const map: Record<string, string> = {
    'New Moon': '🌑', 'Waxing Crescent': '🌒', 'First Quarter': '🌓',
    'Waxing Gibbous': '🌔', 'Full Moon': '🌕', 'Waning Gibbous': '🌖',
    'Last Quarter': '🌗', 'Waning Crescent': '🌘',
  };
  return <span className="text-4xl">{map[phaseName] ?? '🌙'}</span>;
}

function TwilightTimeline({ sun }: { sun: SunTimes }) {
  const events = [
    { label: 'Sunset',        time: sun.sunset,                color: '#FFD166' },
    { label: 'Civil Dusk',    time: sun.civilDuskEnd,          color: '#f97316' },
    { label: 'Nautical Dusk', time: sun.nauticalDuskEnd,       color: '#7A5FFF' },
    { label: 'Astro Dusk',    time: sun.astronomicalDuskEnd,   color: '#38F0FF' },
    { label: 'Astro Dawn',    time: sun.astronomicalDawnStart, color: '#38F0FF' },
    { label: 'Nautical Dawn', time: sun.nauticalDawnStart,     color: '#7A5FFF' },
    { label: 'Civil Dawn',    time: sun.civilDawnStart,        color: '#f97316' },
    { label: 'Sunrise',       time: sun.sunrise,               color: '#FFD166' },
  ];

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div>
        <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-1">Sun & Twilight Timeline</p>
        <p className="text-xs text-[var(--text-secondary)]">
          Best observation window:{' '}
          <span style={{ color: '#38F0FF' }}>{sun.astronomicalDuskEnd}</span>
          {' '}→{' '}
          <span style={{ color: '#38F0FF' }}>{sun.astronomicalDawnStart}</span>
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {events.map(e => (
          <div key={e.label} className="flex flex-col gap-0.5">
            <span className="text-[10px] text-[var(--text-dim)] tracking-wide">{e.label}</span>
            <span className="text-sm font-mono font-bold" style={{ color: e.color }}>{e.time}</span>
          </div>
        ))}
      </div>
      {/* Visual bar */}
      <div className="h-3 rounded-full overflow-hidden w-full" style={{
        background: 'linear-gradient(to right, #FFD166 0%, #f97316 8%, #7A5FFF 18%, #38F0FF 28%, #070B14 50%, #38F0FF 72%, #7A5FFF 82%, #f97316 92%, #FFD166 100%)'
      }}>
        <div className="h-full w-full relative">
          <span
            className="absolute top-1/2 -translate-y-1/2 text-[8px] text-white/60 whitespace-nowrap"
            style={{ left: '50%', transform: 'translateX(-50%) translateY(-50%)' }}
          >
            BEST WINDOW
          </span>
        </div>
      </div>
    </div>
  );
}

function MoonCard({ moon }: { moon: MoonInfo }) {
  const intColor = moon.interference === 'Low' ? '#34d399' : moon.interference === 'Medium' ? '#FFD166' : '#f87171';
  return (
    <div
      className="glass-card p-5 flex flex-col gap-4"
      style={{ borderColor: 'rgba(255,209,102,0.2)', boxShadow: '0 0 40px rgba(255,209,102,0.06)' }}
    >
      <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase">Moon Tonight</p>
      <div className="flex items-center gap-5">
        <MoonPhaseEmoji phaseName={moon.phaseName} />
        <div>
          <p className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#FFD166' }}>{moon.phaseName}</p>
          <p className="text-[var(--text-secondary)] text-sm">{moon.illumination}% illuminated</p>
          <p className="text-[var(--text-secondary)] text-xs mt-0.5">{moon.constellation}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wide">Moonrise</p>
          <p className="text-sm font-mono" style={{ color: '#FFD166' }}>{moon.riseTime ?? '—'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wide">Moonset</p>
          <p className="text-sm font-mono" style={{ color: '#7A5FFF' }}>{moon.setTime ?? '—'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wide">Altitude</p>
          <p className="text-sm font-mono" style={{ color: '#38F0FF' }}>{moon.altitude}°</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full self-start text-xs"
        style={{ background: `${intColor}15`, border: `1px solid ${intColor}40`, color: intColor }}>
        Deep-sky interference: <strong className="ml-1">{moon.interference}</strong>
      </div>
    </div>
  );
}

function PlanetCard({ planet }: { planet: PlanetInfo }) {
  const img = PLANETS.find(p => p.name === planet.name)?.imageUrl;
  const accent = planet.isVisible ? '#34d399' : '#f87171';
  return (
    <div
      className="glass-card overflow-hidden flex flex-col"
      style={{ borderColor: `${accent}22` }}
    >
      {img && (
        <div className="w-full h-28 overflow-hidden">
          <img src={img} alt={planet.name} className="w-full h-full object-cover opacity-70" />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{planet.symbol}</span>
            <span className="font-bold text-base" style={{ fontFamily: 'Georgia, serif' }}>{planet.name}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: `${accent}18`, border: `1px solid ${accent}40`, color: accent }}>
            {planet.isVisible ? 'Visible ✓' : 'Below Horizon ✗'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          <div>
            <p className="text-[var(--text-dim)] uppercase tracking-wide text-[9px]">Rise</p>
            <p style={{ color: '#FFD166' }}>{planet.riseTime ?? '—'}</p>
          </div>
          <div>
            <p className="text-[var(--text-dim)] uppercase tracking-wide text-[9px]">Set</p>
            <p style={{ color: '#7A5FFF' }}>{planet.setTime ?? '—'}</p>
          </div>
          <div>
            <p className="text-[var(--text-dim)] uppercase tracking-wide text-[9px]">Transit</p>
            <p style={{ color: '#38F0FF' }}>{planet.transitTime ?? '—'}</p>
          </div>
          <div>
            <p className="text-[var(--text-dim)] uppercase tracking-wide text-[9px]">Altitude</p>
            <p className="text-[var(--text-primary)]">{planet.altitude}°</p>
          </div>
          <div>
            <p className="text-[var(--text-dim)] uppercase tracking-wide text-[9px]">Magnitude</p>
            <p className="text-[var(--text-primary)]">{planet.magnitude}</p>
          </div>
          <div>
            <p className="text-[var(--text-dim)] uppercase tracking-wide text-[9px]">Constellation</p>
            <p className="text-[var(--text-primary)] truncate">{planet.constellation}</p>
          </div>
        </div>

        {PLANET_DESCRIPTIONS[planet.name] && (
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed italic border-t border-white/5 pt-2">
            {PLANET_DESCRIPTIONS[planet.name]}
          </p>
        )}
      </div>
    </div>
  );
}

function DeepSkyCard({ obj }: { obj: DeepSkyObject }) {
  return (
    <div className="glass-card p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <p className="font-bold text-sm" style={{ fontFamily: 'Georgia, serif', color: '#38F0FF' }}>{obj.name}</p>
        <span className="text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: 'rgba(56,240,255,0.08)', border: '1px solid rgba(56,240,255,0.2)', color: '#38F0FF' }}>
          Mag {obj.magnitude}
        </span>
      </div>
      <p className="text-[10px] text-[var(--text-dim)]">{obj.type} · {obj.constellation}</p>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{obj.description}</p>
    </div>
  );
}

export default function TonightPage() {
  const now = new Date();
  const planets = getAllPlanets(now);
  const moon = getMoonInfo(now);
  const sun = getSunTimes(now);
  const deepSky = getDeepSkyObjects(now);

  const visibleCount = planets.filter(p => p.isVisible).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-page-enter flex flex-col gap-10">

      {/* Header */}
      <div>
        <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-1">— {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Tbilisi' })} —</p>
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
          Tonight's Sky —{' '}
          <span style={{ color: '#7A5FFF' }}>Tbilisi</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {visibleCount} of 7 planets visible · Lat 41.7° N, Lon 44.8° E
        </p>
      </div>

      {/* Twilight Timeline */}
      <TwilightTimeline sun={sun} />

      {/* Moon */}
      <MoonCard moon={moon} />

      {/* Planet Grid */}
      <div>
        <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-4">— Planets Tonight —</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {planets.map(p => <PlanetCard key={p.name} planet={p} />)}
        </div>
      </div>

      {/* Deep Sky Objects */}
      <div>
        <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-4">— Notable Deep Sky Objects —</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deepSky.map(obj => <DeepSkyCard key={obj.name} obj={obj} />)}
        </div>
      </div>

    </div>
  );
}

export const metadata = {
  title: "Tonight's Sky | SkyWatcher by Astroman",
  description: 'Everything visible tonight from Tbilisi — planets, moon phase, twilight times, and deep sky objects.',
};
