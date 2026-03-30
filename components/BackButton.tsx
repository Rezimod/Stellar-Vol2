'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
}

export default function BackButton({ label = 'უკან' }: BackButtonProps) {
  const router = useRouter();

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    function onTouchStart(e: TouchEvent) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
    function onTouchEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
      // Right swipe from left edge (first 40px) of at least 80px
      if (touchStartX < 40 && dx > 80 && dy < 60) {
        router.back();
      }
    }
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [router]);

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 text-xs mb-4 transition-colors hover:opacity-80"
      style={{ color: 'var(--text-dim)' }}
    >
      <ChevronLeft size={15} />
      {label}
    </button>
  );
}
