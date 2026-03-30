import Link from 'next/link';
import { ArrowRight, Cloud, Star } from 'lucide-react';
import { getWeatherData, getSeeingLabel, getCloudLabel } from '@/lib/weather';
import { getAllPlanets } from '@/lib/astronomy';

export default async function Hero() {
  let cloudCover: number | null = null;
  let seeing: string | null = null;
  let visiblePlanets = 0;

  try {
    const [weather, planets] = await Promise.all([
      getWeatherData(),
      Promise.resolve(getAllPlanets(new Date())),
    ]);
    cloudCover = weather.current.cloudCover;
    seeing = getSeeingLabel(weather.current);
    visiblePlanets = planets.filter(p => p.isVisible).length;
  } catch {
    // show static fallback if fetch fails
  }

  const seeingColor = seeing === 'Excellent' ? '#34d399' : seeing === 'Good' ? '#38F0FF' : seeing === 'Fair' ? '#FFD166' : '#f87171';

  return (
    <section className="text-center flex flex-col items-center gap-6 pt-10 pb-4 px-4">

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest"
        style={{
          background: 'rgba(122,95,255,0.10)',
          border: '1px solid rgba(122,95,255,0.25)',
          color: '#a78bfa',
          boxShadow: '0 0 20px rgba(122,95,255,0.15)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse inline-block" />
        ᲪᲝᲪᲮᲐᲚᲘ ასტრონომიული მონაცემები — თბილისი, საქართველო
      </div>

      {/* Headline */}
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        <span className="animate-word inline-block mr-2" style={{ animationDelay: '200ms' }}>
          <span style={{ color: '#FFD166' }}>შენი ფანჯარა</span>
        </span>
        <br />
        <span
          className="animate-word inline-block mt-2"
          style={{
            animationDelay: '520ms',
            background: 'linear-gradient(135deg, #7A5FFF, #38F0FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ქართულ ღამის ცაში
        </span>
      </h1>

      {/* Subtext */}
      <p
        className="text-base sm:text-lg max-w-lg leading-relaxed animate-fade-up"
        style={{ color: 'var(--text-secondary)', animationDelay: '600ms', opacity: 0 }}
      >
        ცოცხალი ასტრონომიული მონაცემები — ამინდი, პლანეტები და ღამით ხილული ობიექტები.
      </p>

      {/* CTA group */}
      <div
        className="flex flex-col sm:flex-row items-center gap-3 animate-fade-up"
        style={{ animationDelay: '800ms', opacity: 0 }}
      >
        <Link
          href="/tonight"
          className="btn-stellar px-8 py-4 rounded-xl text-base font-bold flex items-center gap-2 animate-glow-pulse"
        >
          <Cloud size={18} />
          ღამის ცა ახლა
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Live mini-widget strip */}
      <div
        className="flex items-center gap-4 text-[11px] flex-wrap justify-center animate-fade-up"
        style={{ animationDelay: '1000ms', opacity: 0 }}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38F0FF]" />
          <span style={{ color: 'var(--text-dim)' }}>
            ღრუბლიანობა: <strong style={{ color: '#38F0FF' }}>{cloudCover !== null ? `${cloudCover}%` : '—'}</strong>
          </span>
        </span>
        <span className="text-white/10">·</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: seeingColor || '#FFD166' }} />
          <span style={{ color: 'var(--text-dim)' }}>
            ხედვა: <strong style={{ color: seeingColor || '#FFD166' }}>{seeing ?? '—'}</strong>
          </span>
        </span>
        <span className="text-white/10">·</span>
        <span className="flex items-center gap-1.5">
          <Star size={10} style={{ color: '#FFD166' }} />
          <span style={{ color: 'var(--text-dim)' }}>
            ხილული პლანეტები: <strong style={{ color: '#FFD166' }}>{visiblePlanets} ღამე</strong>
          </span>
        </span>
      </div>
    </section>
  );
}
