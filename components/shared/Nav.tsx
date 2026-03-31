'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Orbit, Target, ScrollText, LogIn, User, House } from 'lucide-react';
import AstroLogo from './AstroLogo';
import LanguageToggle from '@/components/LanguageToggle';
import UserDropdown from '@/components/UserDropdown';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';

// Custom Saturn icon (rings)
function SaturnIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <ellipse cx="12" cy="12" rx="11" ry="4.5" transform="rotate(-20 12 12)" />
    </svg>
  );
}

// Custom telescope icon
function TelescopeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 10L4 6l1.5-3 6 3-1.5 4z" />
      <path d="M10 10l4 2" />
      <path d="M14 12l5-2" />
      <path d="M12 17l1-5" />
      <path d="M10 21h4" />
      <path d="M12 17v4" />
    </svg>
  );
}

// Shooting star for missions
function ShootingStarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();

  const baseTabs = [
    { href: '/',        label: t('nav.home'),    labelKa: 'მთავარი',   icon: (a: boolean) => <House    size={20} strokeWidth={a ? 2 : 1.5} /> },
    { href: '/tonight', label: t('nav.tonight'), labelKa: 'ღამის ცა', icon: (a: boolean) => <Moon     size={20} strokeWidth={a ? 2 : 1.5} /> },
    { href: '/planets', label: t('nav.planets'), labelKa: 'პლანეტები',icon: (a: boolean) => <SaturnIcon size={20} /> },
    { href: '/blog',    label: t('nav.blog'),    labelKa: 'ბლოგი',    icon: (a: boolean) => <ScrollText size={20} strokeWidth={a ? 2 : 1.5} /> },
  ];

  const missionsTab = {
    href: '/missions',
    label: t('nav.missions'),
    labelKa: 'მისიები',
    icon: (a: boolean) => <ShootingStarIcon size={20} />,
  };

  const tabs = user
    ? [...baseTabs.slice(0, 3), missionsTab, baseTabs[3]]
    : baseTabs;

  return (
    <>
      {/* ── Top nav (always visible) ── */}
      <nav className="glass-nav sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-3">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2.5">
              <AstroLogo heightClass="h-7" />
              <span className="hidden sm:inline text-xs tracking-widest font-mono" style={{ color: '#FFD166' }}>
                SKYWATCHER
              </span>
            </Link>

            {/* Desktop tabs */}
            <div className="hidden md:flex items-center gap-0.5">
              {tabs.map(tab => {
                const active = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${
                      active
                        ? 'text-[#FFD166] bg-[rgba(255,209,102,0.08)] border-b-2 border-[#FFD166]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                    }`}
                  >
                    {tab.icon(active)}
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop right: language + auth */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageToggle />
              {user ? <UserDropdown /> : (
                <div className="flex gap-2">
                  <Link href="/login" className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ border: '1px solid rgba(56,240,255,0.25)', color: '#38F0FF' }}>
                    {t('nav.login')}
                  </Link>
                  <Link href="/signup" className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={{ background: 'rgba(56,240,255,0.12)', border: '1px solid rgba(56,240,255,0.30)', color: '#38F0FF' }}>
                    {t('nav.signup')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile top bar: logo (left) + language toggle (right) */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageToggle />
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
        style={{
          background: 'rgba(7,11,20,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(56,240,255,0.10)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Nav items */}
        {tabs.map(tab => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all duration-200"
              style={{ color: active ? '#38F0FF' : 'rgba(255,255,255,0.35)' }}
            >
              <span style={{ filter: active ? 'drop-shadow(0 0 6px rgba(56,240,255,0.5))' : 'none' }}>
                {tab.icon(active)}
              </span>
              <span className="text-[9px] font-medium tracking-wide">{tab.labelKa}</span>
              {active && (
                <span
                  className="absolute bottom-0 w-6 rounded-full"
                  style={{ height: '2px', background: '#38F0FF', boxShadow: '0 0 8px rgba(56,240,255,0.6)' }}
                />
              )}
            </Link>
          );
        })}

        {/* Auth tab */}
        {user ? (
          <Link
            href="/profile"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all duration-200 relative"
            style={{ color: pathname === '/profile' ? '#38F0FF' : 'rgba(255,255,255,0.35)' }}
          >
            <User size={20} strokeWidth={pathname === '/profile' ? 2 : 1.5} />
            <span className="text-[9px] font-medium tracking-wide">პროფილი</span>
            {pathname === '/profile' && (
              <span className="absolute bottom-0 w-6 rounded-full" style={{ height: '2px', background: '#38F0FF', boxShadow: '0 0 8px rgba(56,240,255,0.6)' }} />
            )}
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all duration-200"
            style={{ color: pathname === '/login' ? '#38F0FF' : 'rgba(255,255,255,0.35)' }}
          >
            <LogIn size={20} strokeWidth={pathname === '/login' ? 2 : 1.5} />
            <span className="text-[9px] font-medium tracking-wide">შესვლა</span>
          </Link>
        )}
      </nav>
    </>
  );
}
