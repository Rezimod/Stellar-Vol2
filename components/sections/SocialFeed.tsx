import { SOCIAL_FEED } from '@/lib/constants';
import type { SocialPost } from '@/lib/types';
import { Heart, Star } from 'lucide-react';

const accentMap = {
  gold:    { border: 'rgba(255,209,102,0.2)', glow: 'rgba(255,209,102,0.10)', text: '#FFD166' },
  cyan:    { border: 'rgba(56,240,255,0.2)',  glow: 'rgba(56,240,255,0.08)',  text: '#38F0FF' },
  purple:  { border: 'rgba(122,95,255,0.2)',  glow: 'rgba(122,95,255,0.08)', text: '#a78bfa' },
  emerald: { border: 'rgba(52,211,153,0.2)',  glow: 'rgba(52,211,153,0.08)', text: '#34d399' },
};

function PostCard({ post }: { post: SocialPost }) {
  const accent = accentMap[post.accent];
  return (
    <div
      className="glass-card p-4 flex flex-col gap-3 group"
      style={{ borderColor: accent.border, boxShadow: `0 4px 24px ${accent.glow}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
          style={{ background: accent.glow, border: `1px solid ${accent.border}`, color: accent.text }}
        >
          {post.user_initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-xs font-semibold truncate">{post.user_name}</p>
          <p className="text-[var(--text-dim)] text-[10px]">{post.created_at}</p>
        </div>
        <Star size={13} style={{ color: accent.text, opacity: 0.7 }} />
      </div>

      {/* Star name */}
      <div>
        <p
          className="text-base font-bold"
          style={{ fontFamily: 'Georgia, serif', color: accent.text }}
        >
          ✦ {post.star_name}
        </p>
        <p className="text-[var(--text-secondary)] text-[11px] mt-0.5">
          For {post.dedicated_to} · {post.constellation}
        </p>
      </div>

      {/* Message */}
      <p className="text-[var(--text-secondary)] text-xs leading-relaxed line-clamp-2 italic">
        "{post.message}"
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <button className="flex items-center gap-1.5 text-[var(--text-dim)] hover:text-red-400 transition-colors text-[11px]">
          <Heart size={12} />
          <span>{post.likes}</span>
        </button>
        <span
          className="text-[10px] font-mono px-2 py-0.5 rounded-full"
          style={{ background: accent.glow, color: accent.text }}
        >
          on Stellar
        </span>
      </div>
    </div>
  );
}

export default function SocialFeed() {
  return (
    <section className="w-full">
      <p className="text-center text-[var(--text-dim)] text-xs mb-8 tracking-widest uppercase">
        — Stars Named by Our Community —
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SOCIAL_FEED.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
