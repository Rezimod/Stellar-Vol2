import Hero from '@/components/sections/Hero';
import SocialFeed from '@/components/sections/SocialFeed';
import UsefulLinks from '@/components/sections/UsefulLinks';
import Pricing from '@/components/sections/Pricing';
import OrnamentLine from '@/components/shared/OrnamentLine';

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-8 flex flex-col gap-16 sm:gap-24 animate-page-enter">
      <Hero />
      <OrnamentLine />
      <SocialFeed />
      <OrnamentLine />
      <UsefulLinks />
      <OrnamentLine />
      <Pricing />
    </div>
  );
}
