export interface StarRecord {
  id: string;
  name: string;
  dedicated_to: string;
  message: string;
  created_at: string;
  owner_name: string;
  occasion_date: string;
  ra: string;           // Right Ascension
  dec: string;          // Declination
  constellation: string;
  magnitude: number;
  tx_hash: string;      // Stellar testnet tx
  certificate_number: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  read_time: number;
  cover_emoji: string;
  content?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  accent: 'gold' | 'cyan' | 'purple';
  badge?: string;
  popular?: boolean;
}

export interface SocialPost {
  id: string;
  user_name: string;
  user_initials: string;
  star_name: string;
  dedicated_to: string;
  message: string;
  constellation: string;
  created_at: string;
  likes: number;
  accent: 'gold' | 'cyan' | 'purple' | 'emerald';
}

export interface UsefulLink {
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  href: string;
  external: boolean;
  accent: 'gold' | 'cyan' | 'purple';
}

export type CreateStep = 'name' | 'date' | 'message' | 'preview' | 'generate';
