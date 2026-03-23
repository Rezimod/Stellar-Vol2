import type { Metadata, Viewport } from 'next';
import './globals.css';
import StarField from '@/components/shared/StarField';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070B14',
};

export const metadata: Metadata = {
  title: 'Astroman Stellar — Name a Star on the Blockchain',
  description: 'Register a real star in a real constellation on the Stellar blockchain. A unique, eternal gift for any occasion.',
  keywords: ['name a star', 'star registry', 'blockchain gift', 'stellar', 'astroman', 'cosmos'],
  openGraph: {
    title: 'Astroman Stellar — Name a Star',
    description: 'Your star. Your name. Sealed forever on the Stellar blockchain.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className="min-h-screen flex flex-col"
        style={{ background: 'var(--bg-void)', color: 'var(--text-primary)' }}
      >
        <StarField />
        <Nav />
        <main className="relative z-10 flex-1 pb-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
