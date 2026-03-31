'use client';

import { useState, useEffect } from 'react';
import { PLANETS, type PlanetData } from '@/lib/planets-data';
import { getAllPlanets } from '@/lib/astronomy';
import type { PlanetInfo } from '@/lib/astronomy';
import { useLanguage } from '@/lib/i18n/context';
import BackButton from '@/components/BackButton';

const PLANET_NAME_KA: Record<string, string> = {
  Mercury: 'მერკური',
  Venus: 'ვენერა',
  Mars: 'მარსი',
  Jupiter: 'იუპიტერი',
  Saturn: 'სატურნი',
  Uranus: 'ურანი',
  Neptune: 'ნეპტუნი',
  Pluto: 'პლუტონი',
};

function PlanetCard({
  planet,
  liveData,
  locale,
}: {
  planet: PlanetData;
  liveData: PlanetInfo | undefined;
  locale: string;
}) {
  const ka = locale === 'ka';
  const accent = liveData?.isVisible ? '#34d399' : '#f87171';
  const accentBg = liveData?.isVisible ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)';

  const facts = [
    { label: ka ? 'მასა' : 'Mass',                value: planet.mass },
    { label: ka ? 'დიამეტრი' : 'Diameter',        value: planet.diameter },
    { label: ka ? 'მანძილი' : 'Distance',          value: planet.distanceFromSun },
    { label: ka ? 'ორბიტის პერიოდი' : 'Orbital Period', value: planet.orbitalPeriod },
    { label: ka ? 'მთვარეები' : 'Moons',           value: String(planet.moons) },
    { label: ka ? 'ტემპერატურა' : 'Temperature',   value: planet.temperatureRange },
  ];

  const displayName = ka ? (PLANET_NAME_KA[planet.name] ?? planet.name) : planet.name;
  const description = ka ? planet.description_ka : planet.description;

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
          style={{ background: 'linear-gradient(to right, transparent 60%, rgba(7,11,20,0.8) 100%)' }}
        />
        <div className="absolute top-3 left-3 text-4xl" style={{ textShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
          {planet.symbol}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Name + live status */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>{displayName}</h2>
            {liveData && (
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: accentBg, border: `1px solid ${accent}40`, color: accent }}
                >
                  {liveData.isVisible
                    ? (ka ? 'ხილულია ღამე ✓' : 'Visible Tonight ✓')
                    : (ka ? 'ჰორიზონტის ქვეშ ✗' : 'Below Horizon ✗')}
                </span>
                {liveData.isVisible && (
                  <span className="text-[10px] text-[var(--text-dim)]">
                    {liveData.constellation} · {ka ? 'სიკ.' : 'Mag'} {liveData.magnitude}
                  </span>
                )}
              </div>
            )}
          </div>
          {liveData && (
            <div className="flex flex-col items-end gap-0.5 text-[11px] text-[var(--text-dim)] text-right">
              {liveData.riseTime && <span>{ka ? 'ამოდის' : 'Rise'} {liveData.riseTime}</span>}
              {liveData.setTime  && <span>{ka ? 'ჩადის' : 'Set'} {liveData.setTime}</span>}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{description}</p>

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
  const { locale } = useLanguage();
  const ka = locale === 'ka';
  const [liveData, setLiveData] = useState<PlanetInfo[]>([]);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const d = new Date();
    setNow(d);
    setLiveData(getAllPlanets(d));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-page-enter flex flex-col gap-8">

      <BackButton />

      {/* Header */}
      <div>
        <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-1">
          {ka ? '— პლანეტების ენციკლოპედია —' : '— Planet Encyclopedia —'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
          {ka ? (
            <>
              <span>მზის </span>
              <span style={{ background: 'linear-gradient(135deg, #7A5FFF, #38F0FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                სისტემა
              </span>
            </>
          ) : (
            <>
              The{' '}
              <span style={{ background: 'linear-gradient(135deg, #7A5FFF, #38F0FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Solar System
              </span>
            </>
          )}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {ka
            ? `რეალური დროის ხილვადობა — თბილისი, საქართველო (41.7° N) · ${now.toLocaleDateString('ka-GE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Tbilisi' })}`
            : `Real-time visibility calculated for Tbilisi, Georgia (41.7° N) · ${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Tbilisi' })}`}
        </p>
      </div>

      {/* Planet cards */}
      {PLANETS.map(planet => {
        const live = liveData.find(p => p.name === planet.name);
        return (
          <div key={planet.name} id={planet.name}>
            <PlanetCard planet={planet} liveData={live} locale={locale} />
          </div>
        );
      })}

    </div>
  );
}
