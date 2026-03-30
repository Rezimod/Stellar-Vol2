import { PLANETS, type PlanetData } from '@/lib/planets-data';
import { getAllPlanets } from '@/lib/astronomy';
import type { Metadata } from 'next';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'The Solar System | SkyWatcher by Astroman',
  description: 'Explore all 8 planets plus Pluto — real-time visibility from Tbilisi, key facts, and stunning NASA imagery.',
};

function PlanetCard({ planet, liveData }: {
  planet: PlanetData;
  liveData: ReturnType<typeof getAllPlanets>[number] | undefined;
}) {
  const accent = liveData?.isVisible ? '#34d399' : '#f87171';
  const accentBg = liveData?.isVisible ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)';

  const facts = [
    { label: 'Mass',           value: planet.mass },
    { label: 'Diameter',       value: planet.diameter },
    { label: 'Distance',       value: planet.distanceFromSun },
    { label: 'Orbital Period', value: planet.orbitalPeriod },
    { label: 'Moons',          value: String(planet.moons) },
    { label: 'Temperature',    value: planet.temperatureRange },
  ];

  return (
    <div className="glass-card overflow-hidden flex flex-col sm:flex-row gap-0">
      {/* Image */}
      <div className="sm:w-64 sm:flex-shrink-0 h-48 sm:h-auto overflow-hidden relative">
        <img
          src={planet.imageUrl}
          alt={planet.name}
          className="w-full h-full object-cover"
          style={{ opacity: 0.85 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, transparent 60%, rgba(7,11,20,0.8) 100%)',
          }}
        />
        {/* Symbol overlay */}
        <div
          className="absolute top-3 left-3 text-4xl"
          style={{ textShadow: '0 0 20px rgba(0,0,0,0.8)' }}
        >
          {planet.symbol}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Name + live status */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{planet.name}</h2>
            {liveData && (
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: accentBg, border: `1px solid ${accent}40`, color: accent }}
                >
                  {liveData.isVisible ? 'Visible Tonight ✓' : 'Below Horizon ✗'}
                </span>
                {liveData.isVisible && (
                  <span className="text-[10px] text-[var(--text-dim)]">
                    in {liveData.constellation} · Mag {liveData.magnitude}
                  </span>
                )}
              </div>
            )}
          </div>
          {liveData && (
            <div className="flex flex-col items-end gap-0.5 text-[11px] text-[var(--text-dim)] text-right">
              {liveData.riseTime && <span>Rise {liveData.riseTime}</span>}
              {liveData.setTime  && <span>Set {liveData.setTime}</span>}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{planet.description}</p>

        {/* Facts grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
          {facts.map(f => (
            <div key={f.label}>
              <p className="text-[9px] text-[var(--text-dim)] uppercase tracking-widest">{f.label}</p>
              <p className="text-xs text-[var(--text-primary)] font-mono mt-0.5">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PlanetsPage() {
  const now = new Date();
  const liveData = getAllPlanets(now);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-page-enter flex flex-col gap-8">

      <BackButton />

      {/* Header */}
      <div>
        <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-1">— Planet Encyclopedia —</p>
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
          The{' '}
          <span style={{
            background: 'linear-gradient(135deg, #7A5FFF, #38F0FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Solar System
          </span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Real-time visibility calculated for Tbilisi, Georgia (41.7° N) ·{' '}
          {now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Tbilisi' })}
        </p>
      </div>

      {/* Planet cards */}
      {PLANETS.map(planet => {
        const live = liveData.find(p => p.name === planet.name);
        return <PlanetCard key={planet.name} planet={planet} liveData={live} />;
      })}

    </div>
  );
}
