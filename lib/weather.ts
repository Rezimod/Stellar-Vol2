export interface SkyConditions {
  temperature: number;
  feelsLike: number;
  cloudCover: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  precipitation: number;
  visibility: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string;
  cloudCover: number;
  temperature: number;
  visibility: number;
}

export interface WeatherData {
  current: SkyConditions;
  hourly: HourlyForecast[];
}

const BASE_URL =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=41.7151&longitude=44.8271' +
  '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m' +
  '&hourly=cloud_cover,visibility,temperature_2m' +
  '&daily=sunrise,sunset' +
  '&timezone=Asia%2FTbilisi' +
  '&forecast_days=1';

export async function getWeatherData(): Promise<WeatherData> {
  const res = await fetch(BASE_URL, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error('Weather fetch failed');
  const data = await res.json();

  const current: SkyConditions = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    cloudCover: data.current.cloud_cover,
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: data.current.wind_direction_10m,
    windGusts: Math.round(data.current.wind_gusts_10m),
    precipitation: data.current.precipitation,
    visibility: Math.round((data.hourly.visibility[0] ?? 10000) / 1000),
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
  };

  const hourly: HourlyForecast[] = data.hourly.time
    .slice(0, 24)
    .map((t: string, i: number) => ({
      time: t,
      cloudCover: data.hourly.cloud_cover[i] ?? 0,
      temperature: Math.round(data.hourly.temperature_2m[i] ?? 0),
      visibility: Math.round((data.hourly.visibility[i] ?? 10000) / 1000),
    }));

  return { current, hourly };
}

export function getObservationRating(c: SkyConditions): number {
  const cloudScore = Math.max(0, 5 - (c.cloudCover / 100) * 5 * 0.4 * (1 / 0.4));
  const humidityScore = c.humidity < 60 ? 1 : c.humidity < 80 ? 0.6 : 0.2;
  const windScore = c.windSpeed < 10 ? 1 : c.windSpeed < 20 ? 0.6 : 0.2;
  const lightScore = 0.8; // Tbilisi estimated Bortle 6-7

  const raw =
    (1 - c.cloudCover / 100) * 0.4 +
    humidityScore * 0.2 +
    windScore * 0.2 +
    lightScore * 0.2;

  return Math.max(1, Math.min(5, Math.round(raw * 5)));
}

export function getSeeingLabel(c: SkyConditions): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
  const score =
    (1 - c.cloudCover / 100) * 0.5 +
    (1 - Math.min(c.windSpeed, 30) / 30) * 0.3 +
    (1 - c.humidity / 100) * 0.2;
  if (score > 0.75) return 'Excellent';
  if (score > 0.5) return 'Good';
  if (score > 0.25) return 'Fair';
  return 'Poor';
}

export function getCloudLabel(pct: number): string {
  if (pct < 10) return 'Clear';
  if (pct < 30) return 'Mostly Clear';
  if (pct < 60) return 'Partly Cloudy';
  if (pct < 85) return 'Mostly Cloudy';
  return 'Overcast';
}

export function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tbilisi',
  });
}
