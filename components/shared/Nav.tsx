'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Moon, ScrollText, LogIn, User, House, Search, X } from 'lucide-react';
import AstroLogo from './AstroLogo';
import LanguageToggle from '@/components/LanguageToggle';
import UserDropdown from '@/components/UserDropdown';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';

function SaturnIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <ellipse cx="12" cy="12" rx="11" ry="4.5" transform="rotate(-20 12 12)" />
    </svg>
  );
}

function ShootingStarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery('');
  }

  const baseTabs = [
    { href: '/',        labelKa: 'მთავარი',   labelEn: 'Home',    icon: (a: boolean) => <House      size={20} strokeWidth={a ? 2 : 1.5} /> },
    { href: '/tonight', labelKa: 'ღამის ცა',  labelEn: 'Tonight', icon: (a: boolean) => <Moon       size={20} strokeWidth={a ? 2 : 1.5} /> },
    { href: '/planets', labelKa: 'პლანეტები', labelEn: 'Planets', icon: (_a: boolean) => <SaturnIcon size={20} /> },
    { href: '/blog',    labelKa: 'ფიდი',      labelEn: 'Feed',    icon: (a: boolean) => <ScrollText  size={20} strokeWidth={a ? 2 : 1.5} /> },
  ];

  const missionsTab = {
    href: '/missions',
    labelKa: 'მისიები', labelEn: 'Missions',
    icon: (_a: boolean) => <ShootingStarIcon size={20} />,
  };

  const tabs = user
    ? [...baseTabs.slice(0, 3), missionsTab, baseTabs[3]]
    : baseTabs;

  return (
    <>
      {/* ── Top nav ── */}
      <nav className="glass-nav sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between gap-2">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <AstroLogo heightClass="h-6" />
              <span className="hidden sm:inline text-[11px] tracking-widest font-mono" style={{ color: '#FFD166' }}>
                SKYWATCHER
              </span>
            </Link>

            {/* Desktop tabs */}
            <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
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
                    <span>{t(`nav.${tab.href === '/' ? 'home' : tab.href.slice(1)}`) || tab.labelEn}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side: search + lang + auth */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-1">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="ძებნა..."
                    className="text-xs px-3 py-1.5 rounded-lg outline-none w-36 sm:w-48"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(56,240,255,0.20)', color: 'var(--text-primary)' }}
                  />
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="p-1.5" style={{ color: 'var(--text-dim)' }}>
                    <X size={15} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-dim)' }}
                >
                  <Search size={16} />
                </button>
              )}

              <LanguageToggle />

              {/* Desktop auth */}
              <div className="hidden md:flex items-center gap-2">
                {user ? <UserDropdown /> : (
                  <>
                    <Link href="/login" className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ border: '1px solid rgba(56,240,255,0.20)', color: '#38F0FF' }}>
                      {t('nav.login')}
                    </Link>
                    <Link href="/signup" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{ background: 'rgba(56,240,255,0.12)', border: '1px solid rgba(56,240,255,0.25)', color: '#38F0FF' }}>
                      {t('nav.signup')}
                    </Link>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
        style={{
          background: 'rgba(7,11,20,0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(56,240,255,0.10)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {tabs.map(tab => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative transition-all duration-200"
              style={{ color: active ? '#38F0FF' : 'rgba(255,255,255,0.30)' }}
            >
              <span style={{ filter: active ? 'drop-shadow(0 0 5px rgba(56,240,255,0.5))' : 'none' }}>
                {tab.icon(active)}
              </span>
              <span className="text-[9px] font-medium">{tab.labelKa}</span>
              {active && (
                <span className="absolute bottom-0 w-5 rounded-full" style={{ height: '2px', background: '#38F0FF' }} />
              )}
            </Link>
          );
        })}
        {user ? (
          <Link
            href="/profile"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative transition-all duration-200"
            style={{ color: pathname === '/profile' ? '#38F0FF' : 'rgba(255,255,255,0.30)' }}
          >
            <User size={20} strokeWidth={pathname === '/profile' ? 2 : 1.5} />
            <span className="text-[9px] font-medium">პროფილი</span>
            {pathname === '/profile' && (
              <span className="absolute bottom-0 w-5 rounded-full" style={{ height: '2px', background: '#38F0FF' }} />
            )}
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all duration-200"
            style={{ color: pathname === '/login' ? '#38F0FF' : 'rgba(255,255,255,0.30)' }}
          >
            <LogIn size={20} strokeWidth={pathname === '/login' ? 2 : 1.5} />
            <span className="text-[9px] font-medium">შესვლა</span>
          </Link>
        )}
      </nav>
    </>
  );
}
