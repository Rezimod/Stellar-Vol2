import { getSunTimes, getDeepSkyObjects, getMoonInfo } from '@/lib/astronomy';
import { getWeatherData, getObservationRating } from '@/lib/weather';
import { Moon, Telescope, Zap } from 'lucide-react';
import Link from 'next/link';

// Meteor showers by month
const METEOR_SHOWERS: Record<number, { name: string; peak: string; rate: string; active: boolean }> = {
  1:  { name: 'Quadrantids',   peak: 'Jan 3-4',    rate: '120/hr', active: true },
  4:  { name: 'Lyrids',        peak: 'Apr 21-22',  rate: '20/hr',  active: true },
  5:  { name: 'Eta Aquariids',  peak: 'May 6-7',    rate: '50/hr',  active: true },
  7:  { name: 'Delta Aquariids',peak: 'Jul 28-29',  rate: '25/hr',  active: true },
  8:  { name: 'Perseids',       peak: 'Aug 11-13',  rate: '100/hr', active: true },
  10: { name: 'Draconids',      peak: 'Oct 7-8',    rate: '10/hr',  active: true },
  11: { name: 'Leonids',        peak: 'Nov 17-18',  rate: '15/hr',  active: true },
  12: { name: 'Geminids',       peak: 'Dec 13-14',  rate: '150/hr', active: true },
};

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

export default async function TonightHighlights() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const sun = getSunTimes(now);
  const deepSky = getDeepSkyObjects(now);
  const featured = deepSky[0];
  const shower = METEOR_SHOWERS[month];
  const moon = getMoonInfo(now);

  let rating = 3;
  try {
    const weather = await getWeatherData();
    rating = getObservationRating(weather.current);
  } catch { /* use default */ }

  const ratingLabel = rating >= 4 ? 'შესანიშნავი' : rating >= 3 ? 'კარგი' : rating >= 2 ? 'საშუალო' : 'ცუდი';
  const ratingColor = rating >= 4 ? '#34d399' : rating >= 3 ? '#38F0FF' : rating >= 2 ? '#FFD166' : '#f87171';

  const moonPhaseKa = MOON_KA[moon.phaseName] ?? moon.phaseName;
  const interferenceKa = moon.interference === 'Low' ? 'დაბალი' : moon.interference === 'Medium' ? 'საშუალო' : 'მაღალი';

  const accentMap = [
    { border: 'rgba(56,240,255,0.25)',  glow: '0 0 40px rgba(56,240,255,0.10)',  text: '#38F0FF',  bg: 'rgba(56,240,255,0.04)', btn: '' },
    { border: 'rgba(255,209,102,0.30)', glow: '0 0 40px rgba(255,209,102,0.15)', text: '#FFD166',  bg: 'rgba(255,209,102,0.06)', btn: 'btn-primary' },
    { border: 'rgba(122,95,255,0.30)',  glow: '0 0 40px rgba(122,95,255,0.15)',  text: '#a78bfa',  bg: 'rgba(122,95,255,0.06)', btn: 'btn-stellar' },
  ];

  const cards = [
    {
      accentIdx: 0,
      badge: null,
      icon: <Moon size={20} style={{ color: '#38F0FF' }} />,
      title: 'დაკვირვების საუკეთესო დრო',
      content: (
        <div className="flex flex-col gap-2.5 flex-1">
          <div>
            <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wide">სიბნელის ფანჯარა</p>
            <p className="text-sm font-mono" style={{ color: '#38F0FF' }}>
              {sun.astronomicalDuskEnd} → {sun.astronomicalDawnStart}
            </p>
          </div>
          <div>
            <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wide">ღამის შეფასება</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif', color: ratingColor }}>
                {ratingLabel}
              </span>
              <span className="text-xs" style={{ color: ratingColor }}>
                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wide">მთვარის გავლენა</p>
            <p className="text-xs text-[var(--text-secondary)]">
              {moonPhaseKa} · {interferenceKa} ({moon.illumination}% lit)
            </p>
          </div>
        </div>
      ),
    },
    {
      accentIdx: 1,
      badge: 'გამორჩეული',
      icon: <Telescope size={20} style={{ color: '#FFD166' }} />,
      title: 'გამორჩეული ობიექტი',
      content: (
        <div className="flex flex-col gap-2 flex-1">
          <p className="font-bold text-lg leading-snug" style={{ fontFamily: 'Georgia, serif', color: '#FFD166' }}>
            {featured.name}
          </p>
          <p className="text-[var(--text-dim)] text-xs">{featured.type} · {featured.constellation} · Mag {featured.magnitude}</p>
          <p className="text-[var(--text-secondary)] text-xs leading-relaxed flex-1">{featured.description}</p>
        </div>
      ),
    },
    {
      accentIdx: 2,
      badge: shower ? 'აქტიური' : null,
      icon: <Zap size={20} style={{ color: '#a78bfa' }} />,
      title: 'მეტეორული ნაკადები',
      content: (
        <div className="flex flex-col gap-2 flex-1">
          {shower ? (
            <>
              <p className="font-bold text-lg" style={{ fontFamily: 'Georgia, serif', color: '#a78bfa' }}>
                {shower.name}
              </p>
              <p className="text-[var(--text-dim)] text-xs">პიკი: {shower.peak}</p>
              <p className="text-[var(--text-secondary)] text-xs">პიკზე {shower.rate.replace('/hr', '/სთ-ში')}</p>
              <p className="text-[var(--text-secondary)] text-xs leading-relaxed flex-1 mt-1">
                შუაღამის შემდეგ გადაიხედე რადიანტისკენ. საუკეთესო ხედვისთვის — ვარსკვლავიანი ცა.
              </p>
            </>
          ) : (
            <p className="text-[var(--text-secondary)] text-xs flex-1">ამ თვეში მძლავრი ნაკადი არ ჩანს. სპორადული ვარსკვლავები ყოველ ღამე ჩანს.</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <section className="w-full">
      <p className="text-center text-[var(--text-dim)] text-xs mb-2 tracking-widest uppercase">— ღამე —</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        ღამის{' '}
        <span style={{ color: '#FFD166' }}>გამორჩეულები</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((card, i) => {
          const a = accentMap[card.accentIdx];
          return (
            <div
              key={i}
              className="glass-card p-6 flex flex-col gap-4 relative transition-all duration-300 hover:-translate-y-1"
              style={{ borderColor: a.border, boxShadow: a.glow }}
            >
              {card.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1"
                  style={{ background: a.bg, border: `1px solid ${a.border}`, color: a.text }}
                >
                  <Zap size={9} />
                  {card.badge}
                </div>
              )}
              <div className="flex items-center gap-2">
                {card.icon}
                <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase">{card.title}</p>
              </div>
              {card.content}
              <Link
                href="/tonight"
                className={`${a.btn || 'btn-ghost'} px-5 py-3 rounded-xl text-sm font-bold text-center`}
                style={!a.btn ? { borderColor: a.border, color: a.text } : {}}
              >
                სრული ინფო
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
