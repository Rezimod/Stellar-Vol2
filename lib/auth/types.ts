export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  total_points: number;
  missions_completed: number;
  created_at: string;
  updated_at: string;
}

export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0,    title_en: 'Beginner Observer',  title_ka: 'დამწყები დამკვირვებელი' },
  { level: 2, xp: 100,  title_en: 'Night Explorer',     title_ka: 'ღამის მკვლევარი' },
  { level: 3, xp: 250,  title_en: 'Star Gazer',         title_ka: 'ვარსკვლავთმრიცხველი' },
  { level: 4, xp: 500,  title_en: 'Sky Hunter',         title_ka: 'ცის მონადირე' },
  { level: 5, xp: 1000, title_en: 'Cosmic Master',      title_ka: 'კოსმოსის ოსტატი' },
  { level: 6, xp: 2000, title_en: 'Galaxy Legend',      title_ka: 'გალაქტიკის ლეგენდა' },
];

export function getLevelTitle(xp: number, locale: 'en' | 'ka'): string {
  let current = LEVEL_THRESHOLDS[0];
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.xp) current = threshold;
  }
  return locale === 'ka' ? current.title_ka : current.title_en;
}

export function getNextLevelXP(xp: number): number {
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp < threshold.xp) return threshold.xp;
  }
  return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].xp;
}
