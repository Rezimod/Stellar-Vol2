'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Cloud, Globe, Moon, BookOpen, Star } from 'lucide-react';
import AstroLogo from './AstroLogo';
import LanguageToggle from '@/components/LanguageToggle';
import AuthButtons from '@/components/AuthButtons';
import UserDropdown from '@/components/UserDropdown';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';

const tabs = [
  { href: '/',        labelKey: 'nav.home',     icon: <Home     size={16} /> },
  { href: '/sky-now', labelKey: 'nav.skyNow',   icon: <Cloud    size={16} /> },
  { href: '/planets', labelKey: 'nav.planets',  icon: <Globe    size={16} /> },
  { href: '/tonight', labelKey: 'nav.tonight',  icon: <Moon     size={16} /> },
  { href: '/missions',labelKey: 'nav.missions', icon: <Star     size={16} /> },
  { href: '/blog',    labelKey: 'nav.blog',     icon: <BookOpen size={16} /> },
];

export default function Nav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <nav className="glass-nav sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-3">

          <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
            <AstroLogo heightClass="h-7" />
            <span
              className="hidden sm:inline text-xs tracking-widest font-mono"
              style={{ color: '#FFD166' }}
            >
              SKYWATCHER
            </span>
          </Link>

          {/* Desktop tabs */}
          <div className="hidden md:flex items-center gap-0.5">
            {tabs.map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${
                  pathname === tab.href
                    ? 'text-[#FFD166] bg-[rgba(255,209,102,0.08)] border-b-2 border-[#FFD166]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{t(tab.labelKey)}</span>
              </Link>
            ))}
          </div>

          {/* Right side: language toggle + auth */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            {user ? <UserDropdown /> : <AuthButtons />}
          </div>

          {/* Mobile icon nav */}
          <div className="flex md:hidden items-center gap-1">
            <LanguageToggle />
            {tabs.map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  pathname === tab.href
                    ? 'text-[#FFD166] bg-[rgba(255,209,102,0.08)]'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-primary)]'
                }`}
                title={t(tab.labelKey)}
              >
                {tab.icon}
              </Link>
            ))}
            {user ? <UserDropdown /> : (
              <Link href="/login" className="p-2 rounded-lg text-[var(--text-dim)] hover:text-[var(--text-primary)]">
                <Star size={16} />
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
