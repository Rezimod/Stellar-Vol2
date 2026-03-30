import Hero from '@/components/sections/Hero';
import SkyConditions from '@/components/sections/SkyConditions';
import PlanetCards from '@/components/sections/PlanetCards';
import TonightHighlights from '@/components/sections/TonightHighlights';
import OrnamentLine from '@/components/shared/OrnamentLine';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SkyWatcher by Astroman — Georgian Night Sky',
  description: 'Real-time sky conditions, planet tracking, and tonight\'s visible celestial objects for stargazers in Georgia.',
};

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-8 flex flex-col gap-16 sm:gap-24 animate-page-enter">
      <Hero />
      <OrnamentLine />
      <SkyConditions />
      <OrnamentLine />
      <PlanetCards />
      <OrnamentLine />
      <TonightHighlights />
    </div>
  );
}
