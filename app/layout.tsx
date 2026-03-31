import type { Metadata, Viewport } from 'next';
import './globals.css';
import StarField from '@/components/shared/StarField';
import Nav from '@/components/shared/Nav';
import Footer from '@/components/shared/Footer';
import { LanguageProvider } from '@/lib/i18n/context';
import { AuthProvider } from '@/lib/auth/context';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070B14',
};

export const metadata: Metadata = {
  title: 'SkyWatcher by Astroman — Georgian Night Sky',
  description: 'Real-time sky conditions, planet tracking, and tonight\'s visible celestial objects for stargazers in Georgia.',
  keywords: ['skywatcher', 'astronomy', 'tbilisi', 'sky conditions', 'planet tracker', 'astroman', 'georgia stargazing'],
  openGraph: {
    title: 'SkyWatcher by Astroman',
    description: 'Real-time sky conditions, planet tracking, and tonight\'s celestial objects — Tbilisi, Georgia.',
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
        <LanguageProvider>
          <AuthProvider>
            <StarField />
            <Nav />
            <main className="relative z-10 flex-1 pb-24 md:pb-10">
              {children}
            </main>
            <div className="hidden md:block">
              <Footer />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
