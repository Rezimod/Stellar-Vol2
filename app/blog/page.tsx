import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/constants';
import { Clock, Tag, ArrowRight } from 'lucide-react';

const categoryColors: Record<string, string> = {
  'Guide':       '#FFD166',
  'Gear':        '#38F0FF',
  'Technology':  '#a78bfa',
  'Observation': '#34d399',
  'Gift Ideas':  '#f97316',
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-page-enter">

      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-3">— Blog —</p>
        <h1
          className="text-3xl sm:text-4xl font-bold"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Astronomy <span style={{ color: '#FFD166' }}>Stories</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-3 max-w-md mx-auto">
          Guides, cosmic stories, gear reviews, and observation tips from the Astroman team.
        </p>
      </div>

      {/* Featured */}
      <Link href={`/blog/${featured.slug}`} className="block mb-8 group">
        <div
          className="glass-card p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden"
          style={{ borderColor: 'rgba(255,209,102,0.20)', boxShadow: '0 0 40px rgba(255,209,102,0.08)' }}
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 opacity-10"
            style={{
              background: 'radial-gradient(circle, rgba(255,209,102,0.4) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)',
            }}
          />
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">{featured.cover_emoji}</span>
            <div>
              <span
                className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,209,102,0.10)',
                  color: categoryColors[featured.category] ?? '#FFD166',
                  border: `1px solid ${(categoryColors[featured.category] ?? '#FFD166')}33`,
                }}
              >
                {featured.category}
              </span>
              <span
                className="ml-2 text-[10px] text-[var(--text-dim)] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/5"
              >
                Featured
              </span>
            </div>
          </div>
          <h2
            className="text-xl sm:text-2xl font-bold group-hover:text-[#FFD166] transition-colors"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {featured.title}
          </h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{featured.excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-dim)]">
            <span className="flex items-center gap-1">
              <Clock size={11} /> {featured.read_time} min read
            </span>
            <span>{featured.date}</span>
            <span className="ml-auto flex items-center gap-1 text-[#FFD166] group-hover:gap-2 transition-all">
              Read <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rest.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <div className="glass-card p-5 flex flex-col gap-3 h-full">
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl leading-none">{post.cover_emoji}</span>
                <span
                  className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    color: categoryColors[post.category] ?? '#94a3b8',
                    background: `${(categoryColors[post.category] ?? '#94a3b8')}14`,
                    border: `1px solid ${(categoryColors[post.category] ?? '#94a3b8')}25`,
                  }}
                >
                  <Tag size={9} className="inline mr-1" />
                  {post.category}
                </span>
              </div>
              <h3
                className="text-sm font-semibold text-white group-hover:text-[#FFD166] transition-colors leading-snug"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {post.title}
              </h3>
              <p className="text-[var(--text-secondary)] text-xs leading-relaxed line-clamp-2 flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-[var(--text-dim)] pt-1 border-t border-white/5">
                <span className="flex items-center gap-1"><Clock size={10} /> {post.read_time} min</span>
                <span>{post.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
