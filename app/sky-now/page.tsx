'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  getWeatherData, getObservationRating, getSeeingLabel,
  getCloudLabel, getWindDirection, formatTime,
  type WeatherData,
} from '@/lib/weather';
import { Cloud, Wind, Droplets, Eye, Sunrise, Sunset, RefreshCw, Thermometer } from 'lucide-react';

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 min

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

export default function SkyNowPage() {
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

  if (loading && !data) return <Skeleton />;

  if (error && !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center animate-page-enter">
        <p className="text-[var(--text-secondary)] mb-4">Failed to load weather data.</p>
        <button onClick={load} className="btn-stellar px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto">
          <RefreshCw size={16} />
          Retry
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

  // Next 12 hours from current hour
  const currentHour = now.getHours();
  const hourlySlice = data!.hourly.filter((_, i) => {
    const h = new Date(_.time).getHours();
    return h >= currentHour;
  }).slice(0, 12);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-page-enter flex flex-col gap-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-1">— Live Dashboard —</p>
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            Sky Conditions —{' '}
            <span style={{ color: '#38F0FF' }}>Tbilisi</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            {now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tbilisi' })}
            {' · '}
            {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Tbilisi' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[11px] text-[var(--text-dim)]">
              Updated {lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tbilisi' })}
            </span>
          )}
          <button
            onClick={load}
            disabled={loading}
            className="btn-ghost px-3 py-2 rounded-xl text-xs flex items-center gap-1.5"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin-slow' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Observation Rating */}
      <div
        className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ borderColor: 'rgba(255,209,102,0.25)', boxShadow: '0 0 40px rgba(255,209,102,0.08)' }}
      >
        <div>
          <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase mb-1.5">Observation Rating</p>
          <StarRating rating={rating} />
          <p className="text-xs text-[var(--text-secondary)] mt-1.5">
            {rating >= 4 ? 'Excellent night for stargazing!' : rating >= 3 ? 'Good conditions — worth going out.' : rating >= 2 ? 'Fair — light observing only.' : 'Poor conditions tonight.'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: `${seeingColor}15`, border: `1px solid ${seeingColor}40`, color: seeingColor }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: seeingColor }} />
          <span className="text-sm font-bold">Seeing: {seeing}</span>
        </div>
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <MetricCard
          icon={<Thermometer size={16} />}
          label="Temperature"
          value={`${c.temperature}°C`}
          sub={`Feels like ${c.feelsLike}°C`}
          accent="#FFD166"
        />
        <MetricCard
          icon={<Cloud size={16} />}
          label="Cloud Cover"
          value={`${c.cloudCover}%`}
          sub={cloudLabel}
          accent="#38F0FF"
        />
        <MetricCard
          icon={<Droplets size={16} />}
          label="Humidity"
          value={`${c.humidity}%`}
          sub={c.humidity < 60 ? 'Comfortable' : c.humidity < 80 ? 'Moderate' : 'High'}
          accent="#7A5FFF"
        />
        <MetricCard
          icon={<Wind size={16} />}
          label="Wind"
          value={`${c.windSpeed} km/h`}
          sub={`${windDir} · Gusts ${c.windGusts} km/h`}
          accent="#34d399"
        />
        <MetricCard
          icon={<Eye size={16} />}
          label="Visibility"
          value={`${c.visibility} km`}
          sub={c.visibility > 15 ? 'Excellent' : c.visibility > 8 ? 'Good' : 'Reduced'}
          accent="#38F0FF"
        />
        <div className="glass-card p-5 flex flex-col gap-2" style={{ borderColor: 'rgba(255,209,102,0.15)' }}>
          <p className="text-xs tracking-widest uppercase text-[var(--text-dim)]">Sun Times</p>
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
        <p className="text-xs text-[var(--text-dim)] tracking-widest uppercase">Hourly Cloud Forecast (next 12h)</p>
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
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#34d399' }} /> Clear (&lt;30%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#38F0FF' }} /> Partly (30–60%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#FFD166' }} /> Cloudy (60–85%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#f87171' }} /> Overcast</span>
        </div>
      </div>
    </div>
  );
}
