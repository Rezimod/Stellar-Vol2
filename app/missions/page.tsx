'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';
import { getAllPlanets, getMoonInfo } from '@/lib/astronomy';
import type { PlanetInfo, MoonInfo } from '@/lib/astronomy';
import BackButton from '@/components/BackButton';

// ── Static mission data ───────────────────────────────────────────────────────

interface MissionDef {
  id: string;
  title_ka: string;
  description_ka: string;
  target_object: string;
  emoji: string;
  points_reward: number;
  xp_reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const EASY_MISSIONS: MissionDef[] = [
  { id: 'moon', title_ka: 'მთვარის ფოტოგრაფია', description_ka: 'გადაიღე მთვარე ნებისმიერი ტელესკოპით ან ბინოკლით. ნათელი ფაზა საუკეთესოა ტოპოგრაფიისთვის.', target_object: 'moon', emoji: '🌕', points_reward: 100, xp_reward: 50, difficulty: 'easy' },
  { id: 'jupiter', title_ka: 'იუპიტერი და მისი მთვარეები', description_ka: 'იუპიტერის 4 გალილეური მთვარე ბინოკლით ჩანს. იპოვე ისინი.', target_object: 'Jupiter', emoji: '🪐', points_reward: 150, xp_reward: 75, difficulty: 'easy' },
  { id: 'saturn', title_ka: 'სატურნის რგოლები', description_ka: 'სატურნის რგოლები მცირე ტელესკოპითაც კი გამოჩნდება. გადაიღე.', target_object: 'Saturn', emoji: '🪐', points_reward: 200, xp_reward: 100, difficulty: 'easy' },
  { id: 'venus', title_ka: 'ვენერა — ყველაზე კაშკაშა ვარსკვლავი', description_ka: 'ვენერა ყველაზე კაშკაშა ობიექტია ცაზე. დაფიქსირე მისი ფაზა.', target_object: 'Venus', emoji: '⭐', points_reward: 100, xp_reward: 50, difficulty: 'easy' },
  { id: 'mars', title_ka: 'წითელი პლანეტა — მარსი', description_ka: 'მარსის მოწითალო ელფერი შეუიარაღებელი თვალითაც ჩანს. გადაიღე.', target_object: 'Mars', emoji: '🔴', points_reward: 120, xp_reward: 60, difficulty: 'easy' },
  { id: 'orion', title_ka: 'ორიონის თანავარსკვლავედი', description_ka: 'ორიონის სარტყელი — 3 ვარსკვლავი პირდაპირ ხაზში. გადაიღე მთელი თანავარსკვლავედი.', target_object: 'orion', emoji: '✨', points_reward: 80, xp_reward: 40, difficulty: 'easy' },
  { id: 'pleiades', title_ka: 'პლეიადები — ვარსკვლავთა გროვა', description_ka: 'შვიდი და(7) — ვარსკვლავთა ეს გროვა შეუიარაღებელი თვალით ჩანს.', target_object: 'pleiades', emoji: '✨', points_reward: 90, xp_reward: 45, difficulty: 'easy' },
];

const MEDIUM_MISSIONS: MissionDef[] = [
  { id: 'orion_nebula', title_ka: 'ორიონის ნისლეული', description_ka: 'M42 — ვარსკვლავების "სახელოსნო" ორიონის ხმლში. ბინოკლით გამოჩნდება.', target_object: 'orion_nebula', emoji: '🌌', points_reward: 300, xp_reward: 150, difficulty: 'medium' },
  { id: 'andromeda', title_ka: 'ანდრომედას გალაქტიკა', description_ka: 'M31 — ყველაზე შორეული ობიექტი შეუიარაღებელი თვალით (2.5 მლნ სინათლის წელი).', target_object: 'andromeda', emoji: '🌌', points_reward: 400, xp_reward: 200, difficulty: 'medium' },
  { id: 'double_cluster', title_ka: 'პერსევსის ორმაგი გროვა', description_ka: 'NGC 869 და NGC 884 — ორი ვარსკვლავთა გროვა ბინოკლის ველში.', target_object: 'double_cluster', emoji: '✨', points_reward: 250, xp_reward: 125, difficulty: 'medium' },
  { id: 'jupiter_detail', title_ka: 'იუპიტერის ღრუბლოვანი ზოლები', description_ka: 'ტელესკოპით 70x+ გადიდებით ჩანს ეკვატორული ზოლები.', target_object: 'Jupiter', emoji: '🪐', points_reward: 350, xp_reward: 175, difficulty: 'medium' },
  { id: 'moon_crater', title_ka: 'მთვარის კრატერები', description_ka: 'ტყვიანი კვარტალის ფაზაში ჩრდილები კრატერებს ყველაზე კარგად გამოავლენს.', target_object: 'moon', emoji: '🌙', points_reward: 200, xp_reward: 100, difficulty: 'medium' },
];

const HARD_MISSIONS: MissionDef[] = [
  { id: 'ring_nebula', title_ka: 'რგოლის ნისლეული', description_ka: 'M57 — მოკვდავი ვარსკვლავის ნარჩენი ლირაში. 4" ტელესკოპი საჭიროა.', target_object: 'ring_nebula', emoji: '💫', points_reward: 600, xp_reward: 300, difficulty: 'hard' },
  { id: 'triangulum', title_ka: 'სამკუთხედის გალაქტიკა', description_ka: 'M33 — ადგილობრივი ჯგუფის მე-3 გალაქტიკა. 3 მლნ სინათლის წელი.', target_object: 'triangulum', emoji: '🌌', points_reward: 700, xp_reward: 350, difficulty: 'hard' },
  { id: 'saturn_cassini', title_ka: 'სატურნის კასინის განხეთქილება', description_ka: 'A და B რგოლებს შორის სიცარიელე — 9" ტელესკოპი + კარგი seeing.', target_object: 'Saturn', emoji: '🪐', points_reward: 800, xp_reward: 400, difficulty: 'hard' },
  { id: 'globular_m13', title_ka: 'M13 — ჰერკულეს გლობულარული გროვა', description_ka: '300,000 ვარსკვლავი 22,200 სინათლის წლის მოშორებით. შთამბეჭდავია ბინოკლით.', target_object: 'm13', emoji: '⭐', points_reward: 650, xp_reward: 325, difficulty: 'hard' },
  { id: 'neptune', title_ka: 'ნეპტუნი — ყველაზე შორი პლანეტა', description_ka: 'სუსტი ლურჯი წერტილი 8" ტელესკოპის ოკულარში. ძნელი პოვნა.', target_object: 'Neptune', emoji: '🔵', points_reward: 900, xp_reward: 450, difficulty: 'hard' },
];

const ALL_MISSIONS = [...EASY_MISSIONS, ...MEDIUM_MISSIONS, ...HARD_MISSIONS];

const DIFFICULTY_COLOR = {
  easy: '#34d399',
  medium: '#FFD166',
  hard: '#f87171',
};

const DIFFICULTY_LABEL = {
  easy: 'მარტივი',
  medium: 'საშუალო',
  hard: 'რთული',
};

// ── Geocoding types ───────────────────────────────────────────────────────────

interface GeoResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

// ── Availability logic ────────────────────────────────────────────────────────

interface AvailabilityResult {
  available: boolean;
  reason: string;
}

function getMissionAvailability(
  mission: MissionDef,
  cloudCover: number,
  planets: PlanetInfo[],
  moon: MoonInfo | null,
  hour: number,
): AvailabilityResult {
  const isNight = hour >= 20 || hour < 6;
  const target = mission.target_object.toLowerCase();

  if (cloudCover > 70) {
    return { available: false, reason: '☁️ ღრუბლიანია' };
  }

  // Moon missions
  if (target === 'moon') {
    if (!moon || moon.altitude < -5) {
      return { available: false, reason: '🌙 მთვარე ჰორიზონტის ქვეშ' };
    }
    return { available: true, reason: '✓ ხელმისაწვდომია' };
  }

  // Planet missions
  const PLANETS = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
  const matchedPlanet = PLANETS.find(p => target === p || target.startsWith(p));
  if (matchedPlanet) {
    const planetName = matchedPlanet.charAt(0).toUpperCase() + matchedPlanet.slice(1);
    const planet = planets.find(p => p.name === planetName);
    if (!planet || !planet.isVisible) {
      return { available: false, reason: '🔭 ჰორიზონტის ქვეშ' };
    }
    if (mission.difficulty === 'hard' && cloudCover > 25) {
      return { available: false, reason: '☁️ ძალიან ღრუბლიანი' };
    }
    return { available: true, reason: '✓ ხელმისაწვდომია' };
  }

  // Constellation / deep sky
  if (!isNight) {
    return { available: false, reason: '☀️ ღამე არ არის' };
  }
  if (mission.difficulty === 'hard' && cloudCover > 25) {
    return { available: false, reason: '☁️ ძალიან ღრუბლიანი' };
  }
  if (cloudCover > 50) {
    return { available: false, reason: '⛅ ძალიან ღრუბლიანი' };
  }
  return { available: true, reason: '✓ ხელმისაწვდომია' };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MissionsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [cloudCover, setCloudCover] = useState<number | null>(null);
  const [planets, setPlanets] = useState<PlanetInfo[]>([]);
  const [moon, setMoon] = useState<MoonInfo | null>(null);
  const [authMsg, setAuthMsg] = useState<string | null>(null);

  // Location
  const [location, setLocation] = useState({ lat: 41.7151, lon: 44.8271, name: 'თბილისი' });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [locationResults, setLocationResults] = useState<GeoResult[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=cloud_cover,temperature_2m&forecast_days=1`
      );
      const data = await res.json();
      setCloudCover(data?.current?.cloud_cover ?? 50);
    } catch {
      setCloudCover(50);
    }
  }, []);

  // Fetch weather on location change
  useEffect(() => {
    fetchWeather(location.lat, location.lon);
  }, [location, fetchWeather]);

  // Compute planet/moon data client-side
  useEffect(() => {
    const now = new Date();
    setPlanets(getAllPlanets(now));
    setMoon(getMoonInfo(now));
  }, []);

  async function searchLocation() {
    if (!locationInput.trim()) return;
    setGeoLoading(true);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationInput)}&count=5&language=en&format=json`
      );
      const data = await res.json();
      const results: GeoResult[] = (data.results ?? []).slice(0, 3).map((r: { name: string; country: string; latitude: number; longitude: number }) => ({
        name: r.name,
        country: r.country,
        latitude: r.latitude,
        longitude: r.longitude,
      }));
      setLocationResults(results);
    } catch {
      setLocationResults([]);
    }
    setGeoLoading(false);
  }

  function selectLocation(r: GeoResult) {
    setLocation({ lat: r.latitude, lon: r.longitude, name: `${r.name}, ${r.country}` });
    setShowLocationPicker(false);
    setLocationInput('');
    setLocationResults([]);
    setCloudCover(null);
  }

  const hour = new Date().getHours();
  const cover = cloudCover ?? 50;

  // Sky banner config
  let bannerBg = 'rgba(52,211,153,0.10)';
  let bannerBorder = 'rgba(52,211,153,0.25)';
  let bannerColor = '#34d399';
  let bannerText = '☀️ ცა ნათელია — მისიები ხელმისაწვდომია';
  if (cover > 70) {
    bannerBg = 'rgba(248,113,113,0.10)';
    bannerBorder = 'rgba(248,113,113,0.25)';
    bannerColor = '#f87171';
    bannerText = '☁️ ცა დაფარულია ღრუბლებით — დაკვირვება შეუძლებელია';
  } else if (cover >= 30) {
    bannerBg = 'rgba(255,209,102,0.10)';
    bannerBorder = 'rgba(255,209,102,0.25)';
    bannerColor = '#FFD166';
    bannerText = '⛅ ნაწილობრივ ღრუბლიანი — ზოგი მისია შესაძლებელია';
  }

  const filtered = filter === 'all' ? ALL_MISSIONS : ALL_MISSIONS.filter(m => m.difficulty === filter);

  const filterTabs: Array<'all' | 'easy' | 'medium' | 'hard'> = ['all', 'easy', 'medium', 'hard'];

  const filterLabel: Record<string, string> = {
    all: 'ყველა',
    easy: 'მარტივი',
    medium: 'საშუალო',
    hard: 'რთული',
  };

  function handleStartMission() {
    if (!user) {
      setAuthMsg('გთხოვთ, გაიაროთ ავტორიზაცია მისიის დასაწყებად');
      setTimeout(() => setAuthMsg(null), 3500);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-page-enter">
      <BackButton />

      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-2">— SkyWatcher —</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          {t('missions.title')}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
          {t('missions.subtitle')}
        </p>
      </div>

      {/* Location row */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <span className="text-xs" style={{ color: 'var(--text-dim)' }}>📍 {location.name}</span>
        <button
          onClick={() => setShowLocationPicker(v => !v)}
          className="text-xs px-3 py-1 rounded-full transition-all"
          style={{
            background: 'rgba(56,240,255,0.08)',
            border: '1px solid rgba(56,240,255,0.20)',
            color: '#38F0FF',
          }}
        >
          შეცვლა
        </button>
      </div>

      {/* Location picker dropdown */}
      {showLocationPicker && (
        <div
          className="max-w-sm mx-auto mb-6 p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchLocation()}
              placeholder="ქალაქის სახელი..."
              className="flex-1 bg-transparent outline-none text-xs px-3 py-2 rounded-xl"
              style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'var(--text-primary)' }}
            />
            <button
              onClick={searchLocation}
              disabled={geoLoading}
              className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(56,240,255,0.12)', color: '#38F0FF', border: '1px solid rgba(56,240,255,0.25)' }}
            >
              {geoLoading ? '...' : 'ძებნა'}
            </button>
          </div>
          {locationResults.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {locationResults.map((r, i) => (
                <button
                  key={i}
                  onClick={() => selectLocation(r)}
                  className="text-left px-3 py-2 rounded-xl text-xs transition-all hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                >
                  {r.name}, {r.country}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sky condition banner */}
      <div
        className="mb-8 px-5 py-4 rounded-2xl flex items-center justify-between gap-4"
        style={{ background: bannerBg, border: `1px solid ${bannerBorder}` }}
      >
        <span className="text-sm font-medium" style={{ color: bannerColor }}>
          {cloudCover === null ? '⏳ ამინდი იტვირთება...' : bannerText}
        </span>
        <span className="text-xs font-bold shrink-0" style={{ color: bannerColor }}>
          {cloudCover !== null ? `${cloudCover}%` : ''}
        </span>
      </div>

      {/* Auth message toast */}
      {authMsg && (
        <div
          className="mb-6 px-4 py-3 rounded-xl text-center text-xs font-medium"
          style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}
        >
          {authMsg}
        </div>
      )}

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
            {filterLabel[tab]}
          </button>
        ))}
      </div>

      {/* Mission grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(mission => {
          const avail = getMissionAvailability(mission, cover, planets, moon, hour);
          const diffColor = DIFFICULTY_COLOR[mission.difficulty];

          return (
            <div
              key={mission.id}
              className="glass-card p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                borderColor: avail.available
                  ? `rgba(${mission.difficulty === 'easy' ? '52,211,153' : mission.difficulty === 'medium' ? '255,209,102' : '248,113,113'},0.20)`
                  : 'rgba(255,255,255,0.06)',
                opacity: avail.available ? 1 : 0.65,
              }}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl leading-none">{mission.emoji}</span>
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: `${diffColor}18`, color: diffColor }}
                >
                  {DIFFICULTY_LABEL[mission.difficulty]}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-base leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                {mission.title_ka}
              </h3>

              {/* Description */}
              <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
                {mission.description_ka}
              </p>

              {/* Points / XP */}
              <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--text-dim)' }}>
                <span style={{ color: '#38F0FF' }}>{mission.points_reward} ქულა</span>
                <span>·</span>
                <span style={{ color: '#a78bfa' }}>{mission.xp_reward} XP</span>
              </div>

              {/* Availability badge */}
              <div
                className="text-[10px] px-3 py-1.5 rounded-full text-center font-medium"
                style={{
                  background: avail.available ? 'rgba(52,211,153,0.10)' : 'rgba(255,255,255,0.04)',
                  color: avail.available ? '#34d399' : 'var(--text-dim)',
                }}
              >
                {avail.available ? 'ხელმისაწვდომია ✓' : avail.reason}
              </div>

              {/* Action button */}
              <button
                onClick={handleStartMission}
                disabled={!avail.available}
                className="py-2.5 rounded-xl text-xs font-bold text-center transition-all"
                style={avail.available
                  ? { background: 'linear-gradient(135deg, rgba(56,240,255,0.15), rgba(168,139,250,0.15))', border: '1px solid rgba(56,240,255,0.25)', color: '#38F0FF' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-dim)', cursor: 'not-allowed' }
                }
              >
                {avail.available ? 'მისია დაიწყება' : 'მიუწვდომელია'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
