import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Tonight's Sky — SkyWatcher",
  description: 'Live sky conditions, moon phase, planet positions, and deep sky objects for tonight.',
};

export default function TonightLayout({ children }: { children: React.ReactNode }) {
  return children;
}
