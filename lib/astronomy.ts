import {
  Observer,
  Body,
  Equator,
  Horizon,
  Illumination,
  SearchRiseSet,
  SearchHourAngle,
  MoonPhase,
  Constellation,
  SearchAltitude,
} from 'astronomy-engine';

const LAT = 41.7151;
const LON = 44.8271;
const OBSERVER = new Observer(LAT, LON, 0);

const PLANET_BODIES = [
  'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune',
] as const;

export type PlanetBody = typeof PLANET_BODIES[number];

export interface PlanetInfo {
  name: PlanetBody;
  symbol: string;
  altitude: number;
  azimuth: number;
  magnitude: number;
  constellation: string;
  riseTime: string | null;
  setTime: string | null;
  transitTime: string | null;
  isVisible: boolean;
  illumination?: number;
  angularDiameter: string;
}

export interface MoonInfo {
  phase: string;
  phaseName: string;
  illumination: number;
  altitude: number;
  riseTime: string | null;
  setTime: string | null;
  constellation: string;
  interference: 'Low' | 'Medium' | 'High';
}

export interface SunTimes {
  sunrise: string;
  sunset: string;
  civilDawnStart: string;
  civilDuskEnd: string;
  nauticalDawnStart: string;
  nauticalDuskEnd: string;
  astronomicalDawnStart: string;
  astronomicalDuskEnd: string;
}

const SYMBOLS: Record<string, string> = {
  Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '⛢', Neptune: '♆',
};

const ANG_DIAMETER: Record<string, string> = {
  Mercury: '6.3"', Venus: '25"', Mars: '9"',
  Jupiter: '40"', Saturn: '17"', Uranus: '3.7"', Neptune: '2.3"',
};

function fmtTime(date: Date | null): string | null {
  if (!date) return null;
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tbilisi',
  });
}

function tryRise(body: Body, date: Date): Date | null {
  try {
    return SearchRiseSet(body, OBSERVER, +1, date, 1)?.date ?? null;
  } catch { return null; }
}

function trySet(body: Body, date: Date): Date | null {
  try {
    return SearchRiseSet(body, OBSERVER, -1, date, 1)?.date ?? null;
  } catch { return null; }
}

function tryTransit(body: Body, date: Date): Date | null {
  try {
    return SearchHourAngle(body, OBSERVER, 0, date, +1)?.time?.date ?? null;
  } catch { return null; }
}

function getBodyEnum(name: string): Body {
  return Body[name as keyof typeof Body];
}

export function getPlanetInfo(name: PlanetBody, date: Date): PlanetInfo {
  const body = getBodyEnum(name);
  const eq = Equator(body, date, OBSERVER, true, true);
  const hz = Horizon(date, OBSERVER, eq.ra, eq.dec, 'normal');
  const illum = Illumination(body, date);

  return {
    name,
    symbol: SYMBOLS[name],
    altitude: Math.round(hz.altitude * 10) / 10,
    azimuth: Math.round(hz.azimuth * 10) / 10,
    magnitude: Math.round(illum.mag * 10) / 10,
    constellation: Constellation(eq.ra, eq.dec).name,
    riseTime: fmtTime(tryRise(body, date)),
    setTime: fmtTime(trySet(body, date)),
    transitTime: fmtTime(tryTransit(body, date)),
    isVisible: hz.altitude > 5,
    illumination:
      name === 'Venus' || name === 'Mercury'
        ? Math.round(illum.phase_fraction * 100)
        : undefined,
    angularDiameter: ANG_DIAMETER[name] ?? '—',
  };
}

export function getAllPlanets(date: Date): PlanetInfo[] {
  return PLANET_BODIES.map(b => getPlanetInfo(b, date));
}

export function getMoonInfo(date: Date): MoonInfo {
  const moonBody = Body.Moon;
  const eq = Equator(moonBody, date, OBSERVER, true, true);
  const hz = Horizon(date, OBSERVER, eq.ra, eq.dec, 'normal');
  const phase = MoonPhase(date);
  const illum = Illumination(moonBody, date);
  const illumPct = Math.round(illum.phase_fraction * 100);

  let phaseName: string;
  if (phase < 1 || phase >= 359) phaseName = 'New Moon';
  else if (phase < 89) phaseName = 'Waxing Crescent';
  else if (phase < 91) phaseName = 'First Quarter';
  else if (phase < 179) phaseName = 'Waxing Gibbous';
  else if (phase < 181) phaseName = 'Full Moon';
  else if (phase < 269) phaseName = 'Waning Gibbous';
  else if (phase < 271) phaseName = 'Last Quarter';
  else phaseName = 'Waning Crescent';

  const interference: 'Low' | 'Medium' | 'High' =
    illumPct < 25 ? 'Low' : illumPct < 65 ? 'Medium' : 'High';

  return {
    phase: phase.toFixed(1),
    phaseName,
    illumination: illumPct,
    altitude: Math.round(hz.altitude * 10) / 10,
    riseTime: fmtTime(tryRise(moonBody, date)),
    setTime: fmtTime(trySet(moonBody, date)),
    constellation: Constellation(eq.ra, eq.dec).name,
    interference,
  };
}

export function getSunTimes(date: Date): SunTimes {
  const sunBody = Body.Sun;
  const rise = tryRise(sunBody, date);
  const set = trySet(sunBody, date);

  function twilight(altDeg: number, direction: number): Date | null {
    try {
      return SearchAltitude(sunBody, OBSERVER, direction, date, 1, altDeg)?.date ?? null;
    } catch { return null; }
  }

  return {
    sunrise: fmtTime(rise) ?? '—',
    sunset: fmtTime(set) ?? '—',
    civilDawnStart: fmtTime(twilight(-6, +1)) ?? '—',
    civilDuskEnd: fmtTime(twilight(-6, -1)) ?? '—',
    nauticalDawnStart: fmtTime(twilight(-12, +1)) ?? '—',
    nauticalDuskEnd: fmtTime(twilight(-12, -1)) ?? '—',
    astronomicalDawnStart: fmtTime(twilight(-18, +1)) ?? '—',
    astronomicalDuskEnd: fmtTime(twilight(-18, -1)) ?? '—',
  };
}

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export function getSeason(date: Date): Season {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

export interface DeepSkyObject {
  name: string;
  type: string;
  constellation: string;
  magnitude: string;
  description: string;
}

const SEASONAL_OBJECTS: Record<Season, DeepSkyObject[]> = {
  winter: [
    { name: 'Orion Nebula (M42)', type: 'Emission Nebula', constellation: 'Orion', magnitude: '4.0', description: 'A stellar nursery 1,344 ly away — visible to the naked eye as a fuzzy star in Orion\'s sword.' },
    { name: 'Pleiades (M45)', type: 'Open Cluster', constellation: 'Taurus', magnitude: '1.6', description: 'The Seven Sisters. An iconic star cluster containing hot blue stars formed about 100 million years ago.' },
    { name: 'Beehive Cluster (M44)', type: 'Open Cluster', constellation: 'Cancer', magnitude: '3.1', description: 'One of the nearest open clusters — visible to the naked eye under dark skies.' },
    { name: 'Crab Nebula (M1)', type: 'Supernova Remnant', constellation: 'Taurus', magnitude: '8.4', description: 'The remnant of a supernova observed in 1054 AD. At its center lies a pulsar spinning 30 times per second.' },
    { name: 'Double Cluster (NGC 869/884)', type: 'Open Clusters', constellation: 'Perseus', magnitude: '4.4', description: 'Two adjacent young open clusters side by side — one of the most beautiful sights through binoculars.' },
    { name: 'Andromeda Galaxy (M31)', type: 'Galaxy', constellation: 'Andromeda', magnitude: '3.4', description: 'Our nearest large galactic neighbor at 2.5 million light-years. Visible to the naked eye on a clear dark night.' },
  ],
  spring: [
    { name: 'Virgo Cluster (M87)', type: 'Galaxy', constellation: 'Virgo', magnitude: '8.6', description: 'A giant elliptical galaxy hosting a famous supermassive black hole whose shadow was photographed in 2019.' },
    { name: 'Whirlpool Galaxy (M51)', type: 'Galaxy', constellation: 'Canes Venatici', magnitude: '8.4', description: 'A stunning face-on spiral galaxy interacting with its companion NGC 5195.' },
    { name: 'Leo Triplet (M65/M66/NGC 3628)', type: 'Galaxy Group', constellation: 'Leo', magnitude: '9.3', description: 'Three interacting galaxies fitting in a single eyepiece field of view.' },
    { name: 'Beehive Cluster (M44)', type: 'Open Cluster', constellation: 'Cancer', magnitude: '3.1', description: 'One of the nearest open clusters — visible to the naked eye under dark skies.' },
    { name: 'Coma Star Cluster (Mel 111)', type: 'Open Cluster', constellation: 'Coma Berenices', magnitude: '1.8', description: 'A large, bright scattered cluster best viewed with the naked eye or binoculars.' },
    { name: "Markarian's Chain", type: 'Galaxy Group', constellation: 'Virgo', magnitude: '~9.0', description: 'A curving chain of galaxies in the heart of the Virgo Cluster — a breathtaking low-power view.' },
  ],
  summer: [
    { name: 'Ring Nebula (M57)', type: 'Planetary Nebula', constellation: 'Lyra', magnitude: '8.8', description: 'A classic ring-shaped planetary nebula — the ghostly shell of a dying star about 2,300 light-years away.' },
    { name: 'Dumbbell Nebula (M27)', type: 'Planetary Nebula', constellation: 'Vulpecula', magnitude: '7.5', description: 'The first planetary nebula ever discovered, and the brightest in the sky.' },
    { name: 'Wild Duck Cluster (M11)', type: 'Open Cluster', constellation: 'Scutum', magnitude: '5.8', description: 'One of the richest open clusters in the sky — 3,000+ stars in a fan-shaped wedge.' },
    { name: 'Lagoon Nebula (M8)', type: 'Emission Nebula', constellation: 'Sagittarius', magnitude: '6.0', description: 'A vast glowing cloud of hydrogen visible to the naked eye from dark sites.' },
    { name: 'Hercules Cluster (M13)', type: 'Globular Cluster', constellation: 'Hercules', magnitude: '5.8', description: 'The finest globular cluster in the northern sky — contains over 300,000 stars.' },
    { name: 'Omega Nebula (M17)', type: 'Emission Nebula', constellation: 'Sagittarius', magnitude: '6.0', description: 'Also known as the Swan Nebula — one of the brightest star-forming regions in the galaxy.' },
  ],
  autumn: [
    { name: 'Andromeda Galaxy (M31)', type: 'Galaxy', constellation: 'Andromeda', magnitude: '3.4', description: 'Our nearest large galactic neighbor at 2.5 million light-years. Visible to the naked eye on clear nights.' },
    { name: 'Double Cluster (NGC 869/884)', type: 'Open Clusters', constellation: 'Perseus', magnitude: '4.4', description: 'Two adjacent young open clusters — one of the most beautiful sights through binoculars.' },
    { name: 'Triangulum Galaxy (M33)', type: 'Galaxy', constellation: 'Triangulum', magnitude: '5.7', description: 'The third-largest member of our Local Group — the most distant object visible to the naked eye in perfect conditions.' },
    { name: 'ET Cluster (NGC 457)', type: 'Open Cluster', constellation: 'Cassiopeia', magnitude: '6.4', description: 'Nicknamed after E.T., with two bright stars as "eyes" and outstretched chains of stars as arms.' },
    { name: 'Pleiades (M45)', type: 'Open Cluster', constellation: 'Taurus', magnitude: '1.6', description: 'The Seven Sisters rising in the east — one of the most recognizable star clusters in the sky.' },
    { name: 'Perseus Double Cluster', type: 'Open Clusters', constellation: 'Perseus', magnitude: '4.4', description: 'A pair of rich, young open clusters immersed in the Milky Way — sensational in any binoculars.' },
  ],
};

export function getDeepSkyObjects(date: Date): DeepSkyObject[] {
  return SEASONAL_OBJECTS[getSeason(date)];
}
