import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Missions — SkyWatcher',
  description: 'Complete sky observation missions, earn XP, and explore celestial objects from your location.',
};

export default function MissionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
