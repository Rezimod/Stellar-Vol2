import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planets — SkyWatcher',
  description: 'Real-time visibility and data for all planets in our solar system, calculated for your location.',
};

export default function PlanetsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
