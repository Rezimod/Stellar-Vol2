'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  getWeatherData, getObservationRating, getSeeingLabel,
  getCloudLabel, getWindDirection, formatTime,
  type WeatherData,
} from '@/lib/weather';
import { getAllPlanets, getMoonInfo, getSunTimes, getDeepSkyObjects } from '@/lib/astronomy';
import type { PlanetInfo, MoonInfo, SunTimes, DeepSkyObject } from '@/lib/astronomy';
import { PLANETS } from '@/lib/planets-data';
import { Cloud, Wind, Droplets, Eye, Sunrise, Sunset, RefreshCw, Thermometer } from 'lucide-react';
import BackButton from '@/components/BackButton';

const REFRESH_INTERVAL = 10 * 60 * 1000;

const MOON_KA: Record<string, string> = {
  'New Moon': 'ახალმთვარე',
  'Waxing Crescent': 'მზარდი ნამგალა',
  'First Quarter': 'პირველი მეოთხედი',
  'Waxing Gibbous': 'მზარდი ოდნავ სავსე',
  'Full Moon': 'სავსე მთვარე',
  'Waning Gibbous': 'კლებადი ოდნავ სავსე',
  'Last Quarter': 'ბოლო მეოთხედი',
  'Waning Crescent': 'კლებადი ნამგალა',
};

const PLANET_DESC_KA: Record<string, string> = {
  Mercury: 'ეძებე დაბალ ჰორიზონტზე მზის ჩასვლის ან ამოსვლის შემდეგ. ბინოკლი გამოდგება.',
  Venus: 'კაშკაშა "საღამოს ვარსკვლავი" — ძნელია გამოტოვო.',
  Mars: 'გამოირჩევა მოწითალო ელფერით. ტელესკოპით შეიძლება პოლარული ქუდები ჩანდეს.',
  Jupiter: 'კაშკაშა და სტაბილური. ბინოკლითაც კი ჩანს 4 გალილეოს მთვარე.',
  Saturn: 'მისი რგოლები თითქმის ნებისმიერ ტელესკოპშია ხილული — ასტრონომიის ერთ-ერთი საუკეთესო მხედველობა.',
  Uranus: 'სუსტი ლურჯ-მწვანე დისკი, ტელესკოპი სჭირდება.',
  Neptune: 'პატარა ლურჯ-ნაცრისფერი დისკი, ვარსკვლავიდან ძნელი გამოსარჩევი.',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < rating ? '#FFD166' : 'var(--text-dim)', fontSize: 18 }}>★</span>
      ))}
      <span className="text-xs text-[var(--text-secondary)] ml-1">{rating}/5</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-page-enter">
      <div className="h-8 w-64 rounded-lg mb-2" style={{ background: 'rgba(255,255,255,0.05)' }} />
      <div className="h-4 w-40 rounded mb-8" style={{ background: 'rgba(255,255,255,0.03)' }} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-5 h-28" style={{ background: 'rgba(15,31,61,0.3)' }} />
        ))}
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}

function MetricCard({ icon, label, value, sub, accent = '#38F0FF' }: MetricCardProps) {
  return (
    <div
      className="glass-card p-5 flex flex-col gap-2"
      style={{ borderColor: `${accent}22` }}
    >
      <div className="flex items-center gap-2" style={{ color: accent }}>
        {icon}
        <span className="text-xs tracking-widest uppercase text-[var(--text-dim)]">{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif', color: 'var(--text-primary)' }}>
        {value}
      </p>
      {sub && <p className="text-xs text-[var(--text-secondary)]">{sub}</p>}
    </div>
  );
}

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
    { label: 'მზის ჩასვლა',              time: sun.sunset,                color: '#FFD166' },
    { label: 'სამოქალაქო შებინდება',      time: sun.civilDuskEnd,          color: '#f97316' },
    { label: 'საზღვაო შებინდება',         time: sun.nauticalDuskEnd,       color: '#7A5FFF' },
    { label: 'ასტრო შებინდება',           time: sun.astronomicalDuskEnd,   color: '#38F0FF' },
    { label: 'ასტრო გათენება',            time: sun.astronomicalDawnStart, color: '#38F0FF' },
    { label: 'საზღვაო გათენება',          time: sun.nauticalDawnStart,     color: '#7A5FFF' },
    { label: 'სამოქალაქო გათენება',       time: sun.civilDawnStart,        color: '#f97316' },
    { label: 'მზის ამოსვლა',              time: sun.sunrise,               color: '#FFD166' },
  ];

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div>
        <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-1">მზე და შებინდება</p>
        <p className="text-xs text-[var(--text-secondary)]">
          დაკვირვების საუკეთესო ფანჯარა:{' '}
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
  const intKa = moon.interference === 'Low' ? 'დაბალი' : moon.interference === 'Medium' ? 'საშუალო' : 'მაღალი';
  return (
    <div
      className="glass-card p-5 flex flex-col gap-4"
      style={{ borderColor: 'rgba(255,209,102,0.2)', boxShadow: '0 0 40px rgba(255,209,102,0.06)' }}
    >
      <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase">მთვარე ღამე</p>
      <div className="flex items-center gap-5">
        <MoonPhaseEmoji phaseName={moon.phaseName} />
        <div>
          <p className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#FFD166' }}>
            {MOON_KA[moon.phaseName] ?? moon.phaseName}
          </p>
          <p className="text-[var(--text-secondary)] text-sm">{moon.illumination}% განათებული</p>
          <p className="text-[var(--text-secondary)] text-xs mt-0.5">{moon.constellation}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wide">მთვარის ამოსვლა</p>
          <p className="text-sm font-mono" style={{ color: '#FFD166' }}>{moon.riseTime ?? '—'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wide">მთვარის ჩასვლა</p>
          <p className="text-sm font-mono" style={{ color: '#7A5FFF' }}>{moon.setTime ?? '—'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wide">სიმაღლე</p>
          <p className="text-sm font-mono" style={{ color: '#38F0FF' }}>{moon.altitude}°</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full self-start text-xs"
        style={{ background: `${intColor}15`, border: `1px solid ${intColor}40`, color: intColor }}>
        ღრმა ცის ჩარევა: <strong className="ml-1">{intKa}</strong>
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
            {planet.isVisible ? 'ხილული ✓' : 'ჰორიზონტის ქვეშ ✗'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          <div>
            <p className="text-[var(--text-dim)] uppercase tracking-wide text-[9px]">ამოდის</p>
            <p style={{ color: '#FFD166' }}>{planet.riseTime ?? '—'}</p>
          </div>
          <div>
            <p className="text-[var(--text-dim)] uppercase tracking-wide text-[9px]">ჩადის</p>
            <p style={{ color: '#7A5FFF' }}>{planet.setTime ?? '—'}</p>
          </div>
          <div>
            <p className="text-[var(--text-dim)] uppercase tracking-wide text-[9px]">კულმინაცია</p>
            <p style={{ color: '#38F0FF' }}>{planet.transitTime ?? '—'}</p>
          </div>
          <div>
            <p className="text-[var(--text-dim)] uppercase tracking-wide text-[9px]">სიმაღლე</p>
            <p className="text-[var(--text-primary)]">{planet.altitude}°</p>
          </div>
          <div>
            <p className="text-[var(--text-dim)] uppercase tracking-wide text-[9px]">სიკაშკაშე</p>
            <p className="text-[var(--text-primary)]">{planet.magnitude}</p>
          </div>
          <div>
            <p className="text-[var(--text-dim)] uppercase tracking-wide text-[9px]">თანავარსკვლავედი</p>
            <p className="text-[var(--text-primary)] truncate">{planet.constellation}</p>
          </div>
        </div>

        {PLANET_DESC_KA[planet.name] && (
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed italic border-t border-white/5 pt-2">
            {PLANET_DESC_KA[planet.name]}
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
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [now, setNow] = useState(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const d = await getWeatherData();
      setData(d);
      setLastUpdated(new Date());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, REFRESH_INTERVAL);
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => { clearInterval(interval); clearInterval(clock); };
  }, [load]);

  const planets = getAllPlanets(now);
  const moon = getMoonInfo(now);
  const sun = getSunTimes(now);
  const deepSky = getDeepSkyObjects(now);
  const visibleCount = planets.filter(p => p.isVisible).length;

  if (loading && !data) return <Skeleton />;

  if (error && !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center animate-page-enter">
        <p className="text-[var(--text-secondary)] mb-4">ამინდის მონაცემები ვერ ჩაიტვირთა.</p>
        <button onClick={load} className="btn-stellar px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto">
          <RefreshCw size={16} />
          განახლება
        </button>
      </div>
    );
  }

  const c = data!.current;
  const rating = getObservationRating(c);
  const seeing = getSeeingLabel(c);
  const cloudLabel = getCloudLabel(c.cloudCover);
  const windDir = getWindDirection(c.windDirection);

  const seeingColor = seeing === 'Excellent' ? '#34d399' : seeing === 'Good' ? '#38F0FF' : seeing === 'Fair' ? '#FFD166' : '#f87171';

  const seeingKa = seeing === 'Excellent' ? 'შესანიშნავი' : seeing === 'Good' ? 'კარგი' : seeing === 'Fair' ? 'საშუალო' : 'ცუდი';

  const currentHour = now.getHours();
  const hourlySlice = data!.hourly.filter((h) => {
    const hr = new Date(h.time).getHours();
    return hr >= currentHour;
  }).slice(0, 12);

  const ratingText =
    rating >= 4 ? 'შესანიშნავი ღამე ვარსკვლავებისთვის!' :
    rating >= 3 ? 'კარგი პირობები — ღირს გასვლა.' :
    rating >= 2 ? 'საშუალო — მხოლოდ მსუბუქი დაკვირვება.' :
    'ცუდი პირობები ღამით.';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-page-enter flex flex-col gap-10">

      <BackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-1">— ცოცხალი მონაცემები — თბილისი —</p>
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            ღამის ცა
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            {now.toLocaleDateString('ka-GE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Tbilisi' })}
            {' · '}
            {now.toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Tbilisi' })}
          </p>
          <p className="text-[var(--text-secondary)] text-xs mt-0.5">
            {visibleCount} პლანეტი ჩანს ღამე
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[11px] text-[var(--text-dim)]">
              განახლდა {lastUpdated.toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tbilisi' })}
            </span>
          )}
          <button
            onClick={load}
            disabled={loading}
            className="btn-ghost px-3 py-2 rounded-xl text-xs flex items-center gap-1.5"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin-slow' : ''} />
            განახლება
          </button>
        </div>
      </div>

      {/* Observation Rating */}
      <div
        className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ borderColor: 'rgba(255,209,102,0.25)', boxShadow: '0 0 40px rgba(255,209,102,0.08)' }}
      >
        <div>
          <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-1.5">დაკვირვების შეფასება</p>
          <StarRating rating={rating} />
          <p className="text-xs text-[var(--text-secondary)] mt-1.5">{ratingText}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: `${seeingColor}15`, border: `1px solid ${seeingColor}40`, color: seeingColor }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: seeingColor }} />
          <span className="text-sm font-bold">ხედვა: {seeingKa}</span>
        </div>
      </div>

      {/* Weather grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <MetricCard
          icon={<Thermometer size={16} />}
          label="ტემპერატურა"
          value={`${c.temperature}°C`}
          sub={`შეგრძნება ${c.feelsLike}°C`}
          accent="#FFD166"
        />
        <MetricCard
          icon={<Cloud size={16} />}
          label="ღრუბლიანობა"
          value={`${c.cloudCover}%`}
          sub={cloudLabel}
          accent="#38F0FF"
        />
        <MetricCard
          icon={<Droplets size={16} />}
          label="ტენიანობა"
          value={`${c.humidity}%`}
          sub={c.humidity < 60 ? 'კომფორტული' : c.humidity < 80 ? 'ზომიერი' : 'მაღალი'}
          accent="#7A5FFF"
        />
        <MetricCard
          icon={<Wind size={16} />}
          label="ქარი"
          value={`${c.windSpeed} კმ/სთ`}
          sub={`${windDir} · გუბი ${c.windGusts} კმ/სთ`}
          accent="#34d399"
        />
        <MetricCard
          icon={<Eye size={16} />}
          label="ხილვადობა"
          value={`${c.visibility} კმ`}
          sub={c.visibility > 15 ? 'შესანიშნავი' : c.visibility > 8 ? 'კარგი' : 'შეზღუდული'}
          accent="#38F0FF"
        />
        <div className="glass-card p-5 flex flex-col gap-2" style={{ borderColor: 'rgba(255,209,102,0.15)' }}>
          <p className="text-xs tracking-widest uppercase text-[var(--text-dim)]">მზის დრო</p>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#FFD166' }}>
            <Sunrise size={14} />
            <span>{formatTime(c.sunrise)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#7A5FFF' }}>
            <Sunset size={14} />
            <span>{formatTime(c.sunset)}</span>
          </div>
        </div>
      </div>

      {/* Hourly cloud forecast */}
      <div className="glass-card p-5 flex flex-col gap-4">
        <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase">ღრუბლიანობის საათობრივი პროგნოზი</p>
        <div className="flex items-end gap-1 h-20 overflow-x-auto scrollbar-hide">
          {hourlySlice.map((h, i) => {
            const pct = h.cloudCover;
            const barH = Math.max(4, (pct / 100) * 80);
            const color = pct < 30 ? '#34d399' : pct < 60 ? '#38F0FF' : pct < 85 ? '#FFD166' : '#f87171';
            const hour = new Date(h.time).getHours();
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-[36px]">
                <span className="text-[9px] text-[var(--text-dim)]">{pct}%</span>
                <div
                  className="w-full rounded-t-sm"
                  style={{ height: barH, background: color, opacity: 0.7, minWidth: 24 }}
                />
                <span className="text-[9px] text-[var(--text-dim)]">{hour}:00</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 text-[10px] text-[var(--text-dim)]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#34d399' }} /> წმინდა (&lt;30%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#38F0FF' }} /> ნაწილობრივ (30–60%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#FFD166' }} /> ღრუბლიანი (60–85%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#f87171' }} /> მოღრუბლული</span>
        </div>
      </div>

      {/* Twilight Timeline */}
      <TwilightTimeline sun={sun} />

      {/* Moon */}
      <MoonCard moon={moon} />

      {/* Planets Tonight */}
      <div>
        <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-4">— პლანეტები ღამე —</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {planets.map(p => <PlanetCard key={p.name} planet={p} />)}
        </div>
      </div>

      {/* Deep Sky Objects */}
      <div>
        <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-4">— ღრმა ცის ობიექტები —</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deepSky.map(obj => <DeepSkyCard key={obj.name} obj={obj} />)}
        </div>
      </div>

    </div>
  );
}
