import type { BlogPost, PricingPlan, SocialPost, UsefulLink } from './types';

export const ECOSYSTEM = {
  store: 'https://astroman.ge',
  club:  'https://club.astroman.ge',
  app:   '/',
};

export const CONSTELLATIONS = [
  'Orion', 'Ursa Major', 'Cassiopeia', 'Cygnus', 'Leo',
  'Scorpius', 'Andromeda', 'Perseus', 'Aquila', 'Lyra',
  'Gemini', 'Taurus', 'Virgo', 'Sagittarius', 'Aquarius',
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'nova',
    name: 'Nova',
    price: 29,
    currency: 'GEL',
    description: 'Perfect for gifting a special star',
    accent: 'cyan',
    features: [
      'Named star registration',
      'Digital certificate',
      'Stellar testnet proof',
      'Shareable link',
      'Star coordinates',
    ],
  },
  {
    id: 'supernova',
    name: 'Supernova',
    price: 59,
    currency: 'GEL',
    description: 'Premium package with print',
    accent: 'gold',
    badge: 'Most Popular',
    popular: true,
    features: [
      'Everything in Nova',
      'Printable PDF certificate',
      'Custom message engraving',
      'Framed sky chart',
      'Lifetime record',
    ],
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    price: 99,
    currency: 'GEL',
    description: 'Ultimate cosmic experience',
    accent: 'purple',
    features: [
      'Everything in Supernova',
      'Physical certificate mailed',
      'Personalized constellation map',
      'Astroman store credit',
      'Priority support',
    ],
  },
];

export const SOCIAL_FEED: SocialPost[] = [
  {
    id: '1', user_name: 'Nino Beridze', user_initials: 'NB',
    star_name: 'Amiran', dedicated_to: 'My grandfather',
    message: 'For the man who showed me the stars first.',
    constellation: 'Orion', created_at: '2025-12-14', likes: 24, accent: 'gold',
  },
  {
    id: '2', user_name: 'Giorgi K.', user_initials: 'GK',
    star_name: 'Lela', dedicated_to: 'My daughter',
    message: 'You are the brightest thing in my universe.',
    constellation: 'Lyra', created_at: '2025-12-10', likes: 41, accent: 'cyan',
  },
  {
    id: '3', user_name: 'Tamara M.', user_initials: 'TM',
    star_name: 'Vakho', dedicated_to: 'Best friend',
    message: 'Twenty years of friendship, now immortal.',
    constellation: 'Cygnus', created_at: '2025-12-07', likes: 18, accent: 'purple',
  },
  {
    id: '4', user_name: 'Sandro L.', user_initials: 'SL',
    star_name: 'Hope', dedicated_to: 'Our new baby',
    message: 'Born under this star, 03.12.2025.',
    constellation: 'Cassiopeia', created_at: '2025-12-03', likes: 67, accent: 'emerald',
  },
  {
    id: '5', user_name: 'Ana T.', user_initials: 'AT',
    star_name: 'Beso', dedicated_to: 'My husband',
    message: '10 years and counting. Forever in the sky.',
    constellation: 'Leo', created_at: '2025-11-28', likes: 53, accent: 'gold',
  },
  {
    id: '6', user_name: 'David P.', user_initials: 'DP',
    star_name: 'Phantom', dedicated_to: 'My dog',
    message: 'Run free among the stars, buddy.',
    constellation: 'Ursa Major', created_at: '2025-11-21', likes: 92, accent: 'cyan',
  },
];

export const USEFUL_LINKS: UsefulLink[] = [
  {
    icon: '🛒', title: 'astroman.ge', subtitle: 'Main Store',
    desc: 'Telescopes, binoculars & accessories for every astronomer',
    href: 'https://astroman.ge', external: true, accent: 'gold',
  },
  {
    icon: '🏛️', title: 'Astroman Club', subtitle: 'Loyalty Program',
    desc: 'Earn stars for every purchase, redeem for real rewards',
    href: 'https://club.astroman.ge', external: true, accent: 'cyan',
  },
  {
    icon: '✨', title: 'Name a Star', subtitle: 'This App',
    desc: 'Register a star on the Stellar blockchain as a gift',
    href: '/create', external: false, accent: 'purple',
  },
  {
    icon: '📖', title: 'Astronomy Blog', subtitle: 'Learn & Discover',
    desc: 'Guides, observation tips, and cosmic stories',
    href: '/blog', external: false, accent: 'gold',
  },
  {
    icon: '🌐', title: 'Stellar Network', subtitle: 'Blockchain',
    desc: 'Decentralized, fast, and eco-friendly transactions',
    href: 'https://stellar.org', external: true, accent: 'cyan',
  },
  {
    icon: '💬', title: 'Community', subtitle: 'Telegram Group',
    desc: 'Join Georgian astronomy enthusiasts',
    href: 'https://t.me/astroman_ge', external: true, accent: 'purple',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-name-a-star',
    title: 'How to Name a Star: A Complete Guide',
    excerpt: 'Everything you need to know about registering a star on the Stellar blockchain as a meaningful gift.',
    date: '2025-12-15',
    category: 'Guide',
    read_time: 5,
    cover_emoji: '⭐',
    content: `
Naming a star is one of the most unique and personal gifts you can give. Unlike traditional gifts that wear out or get forgotten, a named star is eternal — sealed on a blockchain that will outlast generations.

## What Does "Naming a Star" Actually Mean?

When you register a star through Astroman Stellar, you're creating an immutable record on the Stellar blockchain testnet. Your star's coordinates, your name, your message, and the date are all hashed and stored permanently.

## Step-by-Step

1. **Choose a name** — It can be a person's name, a nickname, a meaningful word.
2. **Select a date** — The occasion that matters.
3. **Write a message** — Up to 280 characters of pure emotion.
4. **Preview** — See your certificate before minting.
5. **Generate** — Your star is assigned real astronomical coordinates in a real constellation.

## The Certificate

Your certificate includes:
- The star's official ID
- Right Ascension and Declination coordinates
- The constellation it belongs to
- The Stellar transaction hash as proof

## Why Stellar Blockchain?

Stellar is fast, eco-friendly, and built for exactly this kind of use case — small, meaningful transactions that last forever. Unlike Ethereum, Stellar has near-zero carbon footprint and fees measured in fractions of a cent.

## Who Is It For?

- **Birthdays** — A star born the same day as someone
- **Anniversaries** — Your love written in the cosmos
- **Memorials** — A light that never goes out
- **New babies** — A cosmic welcome to the universe
- **Graduations** — A constellation of achievement

Start your journey at [astroman.ge](https://astroman.ge).
    `,
  },
  {
    slug: 'best-telescopes-for-beginners-2025',
    title: 'Best Telescopes for Beginners (2025)',
    excerpt: 'Our top picks for amateur astronomers in Georgia — what to buy, what to avoid, and where to find dark skies.',
    date: '2025-12-08',
    category: 'Gear',
    read_time: 7,
    cover_emoji: '🔭',
  },
  {
    slug: 'stellar-blockchain-explained',
    title: "Stellar Blockchain: Why It's Perfect for Cosmic Gifts",
    excerpt: 'A non-technical explanation of why we chose Stellar — speed, cost, and environmental reasons.',
    date: '2025-11-30',
    category: 'Technology',
    read_time: 4,
    cover_emoji: '🔗',
  },
  {
    slug: 'dark-sky-spots-georgia',
    title: 'Best Dark Sky Spots in Georgia',
    excerpt: 'From the Caucasus highlands to the Black Sea coast — where to go for the most spectacular stargazing in Georgia.',
    date: '2025-11-20',
    category: 'Observation',
    read_time: 6,
    cover_emoji: '🌌',
  },
  {
    slug: 'constellations-visible-december',
    title: 'Constellations Visible in December from Georgia',
    excerpt: 'What to look for this month: Orion, Perseus, Taurus, and the famous Geminid meteor shower.',
    date: '2025-11-10',
    category: 'Observation',
    read_time: 5,
    cover_emoji: '✨',
  },
  {
    slug: 'gift-a-star-for-christmas',
    title: 'Why a Named Star Makes the Perfect Christmas Gift',
    excerpt: 'Forget socks. This year, give something truly eternal — a star registered on the blockchain.',
    date: '2025-11-01',
    category: 'Gift Ideas',
    read_time: 3,
    cover_emoji: '🎁',
  },
];
