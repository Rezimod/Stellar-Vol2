'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Star, Gift, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';
import UserAvatar from './UserAvatar';

export default function UserDropdown() {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    router.push('/');
  }

  if (!profile) return null;

  const menuItems = [
    { href: '/profile', label: t('nav.profile'), icon: <User size={15} /> },
    { href: '/missions', label: t('nav.missions'), icon: <Star size={15} /> },
    { href: '/profile#rewards', label: t('rewards.title'), icon: <Gift size={15} /> },
  ];

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2">
        <UserAvatar name={profile.full_name} size="sm" />
        <span className="text-xs hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
          {profile.full_name.split(' ')[0]}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-xl p-1 z-50"
          style={{
            background: 'rgba(7,11,20,0.95)',
            border: '1px solid rgba(56,240,255,0.15)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <div className="px-3 py-2 border-b mb-1" style={{ borderColor: 'rgba(56,240,255,0.10)' }}>
            <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{profile.full_name}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
              {t('missions.level')} {profile.level} · {profile.xp} {t('missions.xp')}
            </p>
          </div>

          {menuItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors hover:bg-white/5"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span style={{ color: '#38F0FF' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs w-full text-left transition-colors hover:bg-white/5 mt-1"
            style={{ color: '#f87171' }}
          >
            <LogOut size={15} />
            {t('nav.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
