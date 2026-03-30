'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Cloud, Globe, Moon, BookOpen, Map } from 'lucide-react';
import AstroLogo from './AstroLogo';

const tabs = [
  { href: '/',        label: 'Home',          icon: <Home     size={16} /> },
  { href: '/sky-now', label: 'Sky Now',        icon: <Cloud    size={16} /> },
  { href: '/planets', label: 'Planets',        icon: <Globe    size={16} /> },
  { href: '/tonight', label: "Tonight's Sky",  icon: <Moon     size={16} /> },
  { href: '/blog',    label: 'Blog',           icon: <BookOpen size={16} /> },
];

export default function Nav() {
  const pathname = usePathname();

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
          <div className="hidden sm:flex items-center gap-0.5">
            {tabs.map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all duration-200 ${
                  pathname === tab.href
                    ? 'text-[#FFD166] bg-[rgba(255,209,102,0.08)] border-b-2 border-[#FFD166]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/sky-now"
            className="btn-stellar px-4 py-2 text-sm rounded-xl hidden sm:flex items-center gap-1.5"
          >
            <Map size={14} />
            Open Sky Map
          </Link>

          {/* Mobile icon nav */}
          <div className="flex sm:hidden items-center gap-0.5">
            {tabs.map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  pathname === tab.href
                    ? 'text-[#FFD166] bg-[rgba(255,209,102,0.08)]'
                    : 'text-[var(--text-dim)] hover:text-[var(--text-primary)]'
                }`}
                title={tab.label}
              >
                {tab.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
