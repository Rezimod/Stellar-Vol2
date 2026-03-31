import { getAllPlanets } from '@/lib/astronomy';
import { PLANETS } from '@/lib/planets-data';
import Link from 'next/link';

export default function PlanetCards() {
  const now = new Date();
  const liveData = getAllPlanets(now);

  return (
    <section className="w-full">
      <p className="text-center text-[var(--text-dim)] text-xs mb-2 tracking-widest uppercase">— მზის სისტემა —</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        პლანეტები{' '}
        <span style={{ color: '#FFD166' }}>ღამე</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLANETS.slice(0, 7).map(planet => {
          const live = liveData.find(p => p.name === planet.name);
          const accent = live?.isVisible ? '#34d399' : '#f87171';
          return (
            <Link
              key={planet.name}
              href={`/planets#${planet.name}`}
              className="glass-card overflow-hidden flex flex-col group cursor-pointer hover:border-opacity-60 transition-all duration-200"
              style={{ borderColor: `${accent}22`, textDecoration: 'none' }}
            >
              {/* Image */}
              <div className="w-full h-32 overflow-hidden relative">
                <img
                  src={planet.imageUrl}
                  alt={planet.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ opacity: 0.75 }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,11,20,0.7) 0%, transparent 60%)' }} />
                <div className="absolute top-2 left-3 text-2xl">{planet.symbol}</div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-2.5 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-base" style={{ fontFamily: 'Georgia, serif' }}>{planet.name}</p>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: `${accent}18`, border: `1px solid ${accent}40`, color: accent }}
                  >
                    {live?.isVisible ? 'ხილული ✓' : 'ჰორიზ. ✗'}
                  </span>
                </div>

                {live && (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                    <div>
                      <span className="text-[var(--text-dim)]">ამოდის: </span>
                      <span style={{ color: '#FFD166' }}>{live.riseTime ?? '—'}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-dim)]">ჩადის: </span>
                      <span style={{ color: '#7A5FFF' }}>{live.setTime ?? '—'}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-dim)]">სიკ.: </span>
                      <span className="text-[var(--text-primary)]">{live.magnitude}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-dim)]">თ.ვ.: </span>
                      <span className="text-[var(--text-primary)] truncate">{live.constellation}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[var(--text-dim)]">ზომა: </span>
                      <span className="text-[var(--text-primary)]">{live.angularDiameter}</span>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center mt-5">
        <Link href="/planets" className="btn-ghost px-5 py-2.5 rounded-xl text-xs font-medium">
          ყველა პლანეტა →
        </Link>
      </div>
    </section>
  );
}
