'use client';
import { useMemo, useEffect, useState } from 'react';

export default function StarField() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const starCount = isMobile ? 45 : 160;

  const stars = useMemo(() => Array.from({ length: starCount }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 1.8 + 0.3,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 9,
    drift: Math.random() * 20 - 10,
  })), [starCount]);

  const shootingStars = useMemo(() => [
    { top: 12, left: 8,  delay: 0,  duration: 13 },
    { top: 30, left: 65, delay: 7,  duration: 16 },
    { top: 60, left: 25, delay: 14, duration: 19 },
    { top: 80, left: 50, delay: 22, duration: 14 },
  ], []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Radial nebula glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 20%, rgba(122,95,255,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(56,240,255,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(255,209,102,0.03) 0%, transparent 50%)
          `,
        }}
      />

      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            '--duration': `${s.duration}s`,
            '--delay': `${s.delay}s`,
            '--drift': `${s.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      {!isMobile && shootingStars.map((ss, i) => (
        <div
          key={`shoot-${i}`}
          className="shooting-star"
          style={{
            top: `${ss.top}%`,
            left: `${ss.left}%`,
            animationDuration: `${ss.duration}s`,
            animationDelay: `${ss.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
