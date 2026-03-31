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
    date: '2026-01-15',
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
    title: 'Best Telescopes for Beginners (2026)',
    excerpt: 'Our top picks for amateur astronomers in Georgia — what to buy, what to avoid, and where to find dark skies.',
    date: '2026-01-08',
    category: 'Gear',
    read_time: 7,
    cover_emoji: '🔭',
    content: `
Starting out in astronomy is one of the most rewarding decisions you can make. The night sky over Georgia is spectacular — from the Caucasus highlands to the valleys around Tbilisi — and the right equipment makes all the difference.

## What Kind of Observer Are You?

Before buying anything, ask yourself: do you want to observe planets in detail, or sweep the sky for galaxies and nebulae? This shapes everything.

- **Planet watchers** need high magnification and a stable mount — a 70mm–90mm refractor or a 6" reflector on an equatorial mount.
- **Deep-sky explorers** need aperture above all else — a Dobsonian is king here. An 8" or 10" Dobsonian fits in a car and shows you thousands of objects.

## Our Top Picks

### Entry Level (under 300 GEL)
The **Sky-Watcher Heritage 130P** is a tabletop Dobsonian with a 130mm mirror. It shows you craters on the Moon, Jupiter's cloud bands, Saturn's rings, and star clusters clearly. It's compact, collimatable, and optically excellent for the price.

### Mid Range (300–700 GEL)
The **Sky-Watcher Explorer 200P** — 8 inches of aperture on an EQ5 mount. It's the first telescope you'll never outgrow. Saturn's Cassini division, the Orion Nebula's core, and Andromeda Galaxy's dust lanes are all within reach.

### For Astrophotography
The **Sky-Watcher Star Adventurer** tracking mount paired with a DSLR and a 200mm telephoto lens is the most affordable way to start capturing nebulae. Budget: 800–1200 GEL. No telescope needed.

## What to Avoid

- **Department store telescopes** advertised by magnification ("500x!") instead of aperture. They are optically poor and mechanically unusable.
- **Go-To computerized mounts** at the entry level — the electronics break, alignment is frustrating, and you learn nothing about the sky.
- **Very short focal ratios (f/4)** without coma correctors — stars look like seagulls at the edges.

## Where to Buy in Georgia

Telescope imports are complicated. Your best options:
- Order directly from [Teleskop-Service](https://www.teleskop-express.de) (Germany) — they ship to Georgia.
- Check [astronomy.ge](https://astroman.ge) for Georgian stock and recommendations.
- Second-hand from the Astroman community Telegram group is often the best value.

## Eyepieces Matter More Than You Think

Whatever telescope you buy, your first upgrade should be a quality eyepiece. A **25mm Plössl** comes with most telescopes and is adequate. Add a **9mm planetary eyepiece** (Celestron X-Cel or Baader Hyperion) and a **2× Barlow lens** — that covers 95% of your observing.

Start under dark skies. The Gombori Pass or anywhere above 1500m elevation will show you more than any telescope in Tbilisi light pollution.
    `,
  },
  {
    slug: 'stellar-blockchain-explained',
    title: "Stellar Blockchain: Why It's Perfect for Cosmic Gifts",
    excerpt: 'A non-technical explanation of why we chose Stellar — speed, cost, and environmental reasons.',
    date: '2026-01-20',
    category: 'Technology',
    read_time: 4,
    cover_emoji: '🔗',
    content: `
When we built Astroman Stellar, we had one requirement above all others: the record had to last. A star named for someone's grandmother should still be findable in fifty years. That constraint eliminated most options immediately.

## Why Not Ethereum?

Ethereum is the most famous blockchain for NFTs and digital ownership. But it has problems for our use case:

- **Gas fees** can exceed $20–$50 per transaction during network congestion — absurd for a 29 GEL gift.
- **Environmental cost** — while Ethereum is now proof-of-stake, its energy history and perception matter.
- **Complexity** — smart contracts, wallets, gas estimation. None of this should burden someone buying a birthday gift.

## Why Stellar?

Stellar was designed for fast, cheap, meaningful transactions between people. It's used by NGOs, remittance services, and financial institutions globally.

- **Transaction fee:** 0.00001 XLM — essentially zero. Under 1 tetri.
- **Confirmation time:** 3–5 seconds. Not minutes, not hours.
- **Energy use:** Stellar uses Federated Byzantine Agreement — no mining, minimal electricity.
- **Permanence:** The Stellar network has operated continuously since 2015 with no downtime.

## What We Actually Store

When you name a star on Astroman, here's what happens:

1. Your star's name, coordinates, constellation, dedication, and message are hashed using SHA-256.
2. That hash — a unique 64-character fingerprint of your data — is submitted as a memo to a Stellar transaction.
3. The transaction is recorded on the Stellar testnet ledger.

The hash itself is the proof. Anyone with your certificate can independently verify that the same data produces the same hash — mathematically impossible to fake.

## Testnet vs. Mainnet

We currently use the Stellar **testnet** — a parallel network with identical technology but no real monetary value. This means:
- Zero cost to you
- Full cryptographic proof of your record
- The same immutability properties

When we move to mainnet, we will migrate all existing records automatically at no charge.

## The Bottom Line

Stellar gives us: permanent records, near-zero cost, instant confirmation, and a clean environmental profile. For a product whose entire value is making something last forever, that's exactly what was needed.
    `,
  },
  {
    slug: 'dark-sky-spots-georgia',
    title: 'Best Dark Sky Spots in Georgia',
    excerpt: 'From the Caucasus highlands to the Black Sea coast — where to go for the most spectacular stargazing in Georgia.',
    date: '2026-02-10',
    category: 'Observation',
    read_time: 6,
    cover_emoji: '🌌',
    content: `
Georgia is one of the most underrated stargazing destinations in the world. The combination of high altitude, low population density outside Tbilisi, and a dry mountain climate creates conditions that rival observatory sites elsewhere in Europe.

## The Bortle Scale

The Bortle scale measures sky darkness from 1 (perfect black sky) to 9 (inner city). Tbilisi center is around 7–8. Most highland locations in Georgia reach 3–4, with remote mountain areas touching 2.

## Top Locations

### Kazbegi / Stepantsminda (2,170m)
The most accessible premium dark sky site. Drive two hours from Tbilisi on the Georgian Military Highway. Above the valley floor, away from town lights, the Milky Way is fully visible including the galactic core and dark nebulae. The Gergeti Trinity Church silhouetted against the stars is unforgettable.

**Best for:** Milky Way photography, wide-field viewing, Andromeda naked-eye.
**When:** June–September (road open, clear nights most frequent).

### Tusheti (2,000–3,000m)
Accessible only via the Abano Pass (one of the highest motorable roads in the Caucasus, 2,926m). The remoteness means Bortle 2 conditions in some locations. The entire region is a UNESCO World Heritage candidate.

**Best for:** Serious observers with portable telescopes, astrophotographers.
**When:** July–September only (pass closes in winter).

### Bakuriani (1,700m)
A ski resort town with relatively low light pollution for its accessibility. Comfortable hotels, paved roads, and clear skies make it ideal for beginners. The plateau above town is excellent.

**Best for:** First dark-sky experience, families, casual naked-eye observation.
**When:** Year-round, best in winter when the atmosphere is stable.

### Javakheti Plateau
The high plateau on the border with Armenia and Turkey. Altitudes of 1,800–2,400m, sparse population, and extraordinarily stable seeing. Vardzia cave city is nearby for a cultural bonus.

**Best for:** Planetary observation (exceptional seeing), galaxy hunting.
**When:** May–October.

### Racha Region (Oni area)
Lesser-known but excellent. The valley towns have minimal light pollution and the surrounding peaks offer higher altitude sites. The drive from Tbilisi is scenic.

**Best for:** Off-the-beaten-path observers who want solitude.
**When:** April–October.

## Practical Tips

- **Acclimatize** — altitude affects your night vision. Give yourself an hour before serious observing.
- **Red flashlights only** — preserve your dark adaptation, which takes 20–30 minutes to develop.
- **Weather apps** — Clear Outside is better than standard weather apps for cloud cover predictions at altitude.
- **Bring more layers than you think** — mountain temperatures drop sharply after sunset, even in August.
- **Check the Moon** — a full Moon washes out faint objects. Plan around new moon weeks.
    `,
  },
  {
    slug: 'constellations-visible-december',
    title: 'Constellations Visible in December from Georgia',
    excerpt: 'What to look for this month: Orion, Perseus, Taurus, and the famous Geminid meteor shower.',
    date: '2026-02-25',
    category: 'Observation',
    read_time: 5,
    cover_emoji: '✨',
    content: `
December and early winter offer some of the best skies of the year from Georgia. Long nights, crisp transparent air, and a sky packed with bright stars and famous deep-sky objects make this the season to get serious about observing.

## The Winter Hexagon

The most striking feature of the winter sky is the Winter Hexagon — a huge asterism formed by six of the brightest stars visible from Georgia:

- **Sirius** (Canis Major) — the brightest star in the entire night sky
- **Rigel** (Orion) — Orion's bright blue-white foot
- **Aldebaran** (Taurus) — the orange eye of the Bull
- **Capella** (Auriga) — a yellow giant almost directly overhead
- **Pollux** (Gemini) — paired with Castor, the twins
- **Procyon** (Canis Minor) — the Little Dog star

Find one and the rest fall into place.

## Orion — The King of Winter

Orion is the centerpiece. Three stars in a straight line (Alnitak, Alnilam, Mintaka) form the Belt — one of the most recognizable patterns in the sky. From the Belt, drop south to find:

- **The Orion Nebula (M42)** — visible to the naked eye as the middle "star" in Orion's Sword. In binoculars it's a cloud of gas. In any telescope, it's breathtaking.
- **The Trapezium** — four young, hot stars at M42's core, visible at 100x.

## Perseus and the Algol Variable

Perseus rides high overhead in December. Look for **Algol** (Beta Persei) — an eclipsing binary star that dims noticeably every 2.87 days when the fainter star passes in front. You can watch it change brightness over the course of an evening.

Also in Perseus: the **Double Cluster (NGC 869 and NGC 884)** — two open clusters side by side, visible to the naked eye as a fuzzy patch and spectacular in binoculars.

## The Pleiades and Hyades (Taurus)

Taurus dominates the early evening sky. The **Pleiades** (Seven Sisters, M45) are an open cluster that most people initially think are a tiny dipper. Under dark skies, observers with good eyes can see 9+ stars.

The **Hyades** form a V-shape around Aldebaran — the nearest open cluster to Earth, just 153 light-years away.

## The Geminid Meteor Shower

The **Geminids** peak around December 13–14 each year and produce up to 120 meteors per hour under ideal conditions — the highest rate of any annual shower. Unlike most showers, Geminids originate from an asteroid (3200 Phaethon), not a comet.

Meteors appear to radiate from near the star Castor in Gemini. Look from 10 PM onward; the peak is typically around 2 AM local time. No telescope needed — just lie back and watch.

## Practical Observing Notes

Dress in more layers than seems sensible. Tbilisi in December can drop to -5°C, and mountain sites hit -15°C or colder. Cold ruins observing sessions faster than clouds. Chemical hand warmers in gloves and a thermal flask of tea are essential equipment.
    `,
  },
  {
    slug: 'gift-a-star-for-christmas',
    title: 'Why a Named Star Makes the Perfect Christmas Gift',
    excerpt: 'Forget socks. This year, give something truly eternal — a star registered on the blockchain.',
    date: '2026-03-01',
    category: 'Gift Ideas',
    read_time: 3,
    cover_emoji: '🎁',
    content: `
Gift-giving is hard. Most gifts are used, forgotten, or thrown away within a year. But some gifts carry meaning that doesn't fade — and those are the ones people remember decades later.

## The Problem with Physical Gifts

Physical gifts have a lifecycle. Clothes go out of style. Electronics become obsolete. Even jewelry sits unworn in drawers. The sentiment behind the gift is real, but the object doesn't hold it forever.

A named star is different. It exists in the sky above us every night. The person you name it for can look up on any clear evening and know it's there.

## What the Recipient Gets

When you name a star through Astroman Stellar, the recipient receives:

- A **digital certificate** with the star's name, coordinates, constellation, and your personal message
- The **star's location** in RA/Dec coordinates — they can find it in any star atlas or astronomy app
- A **Stellar blockchain transaction hash** — cryptographic proof that the record is permanent
- A **shareable link** they can send to anyone

It's something they can show their children and grandchildren. "Look — that's your star."

## Who Is It For?

Named stars work especially well as gifts for:

- **New babies** — register a star on the day they're born. The star will be in the sky for their entire life.
- **Anniversaries** — pick a star in a meaningful constellation, write what you'd never say out loud.
- **Memorials** — a lasting tribute to someone who is gone. Light that never goes out.
- **Graduations and milestones** — a star named for an achievement is more meaningful than a plaque.
- **People who have everything** — if they don't need any object, give them something eternal.

## The Honesty Worth Saying

Naming a star is symbolic, not official — the IAU (International Astronomical Union) doesn't recognize private star names, and no organization can sell you naming rights recognized by the astronomy community. We're transparent about this. What you're registering is a permanent, verifiable personal record on a public blockchain — your private claim, beautifully documented.

That's actually more honest than most "star naming" services, and for the people who matter to you, the symbolism is what counts.

Start at [astroman.ge](https://astroman.ge) and name a star tonight.
    `,
  },
];
