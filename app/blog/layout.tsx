import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feed — SkyWatcher',
  description: 'Share observations, photos, and astronomy stories with the Georgian stargazing community.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
