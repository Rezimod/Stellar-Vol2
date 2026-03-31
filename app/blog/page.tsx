'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Heart, MessageCircle, Share2, Image, Telescope, BookOpen, Newspaper, Send, X } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';

type PostType = 'observation' | 'photo' | 'discussion' | 'news';

interface FeedPost {
  id: string;
  user_name: string;
  user_initials: string;
  avatar_color: string;
  type: PostType;
  content: string;
  image_url?: string;
  likes: number;
  comments: number;
  created_at: string;
  liked?: boolean;
}

const DEMO_POSTS: FeedPost[] = [
  {
    id: '1',
    user_name: 'Giorgi Beridze',
    user_initials: 'GB',
    avatar_color: '#38F0FF',
    type: 'observation',
    content: 'Saturn rings were absolutely stunning last night from Mtatsminda. Could clearly see the Cassini division with my 8" Dobsonian. Best seeing conditions in months — transparency 4/5, seeing 3/5.',
    likes: 24,
    comments: 6,
    created_at: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
  },
  {
    id: '2',
    user_name: 'Nino Kvaratskhelia',
    user_initials: 'NK',
    avatar_color: '#FFD166',
    type: 'photo',
    content: 'Captured Orion Nebula (M42) last week from a dark site near Bakuriani. 120 × 30s exposures stacked in DSS. Still learning astrophotography but loving the process!',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/1200px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg',
    likes: 61,
    comments: 13,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: '3',
    user_name: 'Luka Tsiklauri',
    user_initials: 'LT',
    avatar_color: '#a78bfa',
    type: 'discussion',
    content: 'Question for the community: which eyepiece brand gives the best eye relief for glasses wearers? Currently using Celestron X-Cel but considering Baader Hyperion. Budget around 100 GEL per eyepiece.',
    likes: 8,
    comments: 19,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
  },
  {
    id: '4',
    user_name: 'Mariam Dgebuadze',
    user_initials: 'MD',
    avatar_color: '#34d399',
    type: 'news',
    content: "James Webb's latest image release shows galaxy clusters at z=7.2 — we're seeing light from just 750 million years after the Big Bang. The level of detail in early universe structure is rewriting textbooks. Sharing for anyone who missed the announcement.",
    likes: 45,
    comments: 9,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: '5',
    user_name: 'Davit Abuselidze',
    user_initials: 'DA',
    avatar_color: '#f97316',
    type: 'observation',
    content: 'Jupiter with 4 Galilean moons visible naked-eye separation tonight. Used 10x50 binoculars — could clearly see Io, Europa, Ganymede and Callisto. Even saw hints of the equatorial bands in the telescope at 150x.',
    likes: 33,
    comments: 7,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

const POST_TYPE_CONFIG: Record<PostType, { icon: React.ReactNode; label_en: string; label_ka: string; color: string }> = {
  observation: { icon: <Telescope size={11} />, label_en: 'Observation', label_ka: 'დაკვირვება', color: '#38F0FF' },
  photo:       { icon: <Image size={11} />,     label_en: 'Photo',       label_ka: 'ფოტო',       color: '#FFD166' },
  discussion:  { icon: <MessageCircle size={11} />, label_en: 'Discussion', label_ka: 'განხილვა', color: '#a78bfa' },
  news:        { icon: <Newspaper size={11} />, label_en: 'News',        label_ka: 'სიახლე',     color: '#34d399' },
};

function timeAgo(iso: string, ka: boolean): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return ka ? 'ახლახანს' : 'just now';
  if (mins < 60) return ka ? `${mins} წთ` : `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return ka ? `${hrs} სთ` : `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return ka ? `${days} დ` : `${days}d`;
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ background: `${color}22`, border: `1.5px solid ${color}55`, color }}
    >
      {initials}
    </div>
  );
}

function PostCard({ post, ka, onLike }: { post: FeedPost; ka: boolean; onLike: (id: string) => void }) {
  const cfg = POST_TYPE_CONFIG[post.type];
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(15,31,61,0.55)', border: '1px solid rgba(56,240,255,0.10)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <Avatar initials={post.user_initials} color={post.avatar_color} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-none">{post.user_name}</p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-dim)' }}>{timeAgo(post.created_at, ka)}</p>
        </div>
        <span
          className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ color: cfg.color, background: `${cfg.color}14`, border: `1px solid ${cfg.color}30` }}
        >
          {cfg.icon}
          {ka ? cfg.label_ka : cfg.label_en}
        </span>
      </div>

      {/* Content */}
      <p className="px-4 pb-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {post.content}
      </p>

      {/* Image */}
      {post.image_url && (
        <div className="px-4 pb-3">
          <img
            src={post.image_url}
            alt=""
            className="w-full rounded-xl object-cover"
            style={{ maxHeight: '320px', border: '1px solid rgba(255,255,255,0.06)' }}
          />
        </div>
      )}

      {/* Actions */}
      <div
        className="flex items-center gap-1 px-3 py-2.5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <button
          onClick={() => onLike(post.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
          style={{ color: post.liked ? '#f87171' : 'var(--text-dim)' }}
        >
          <Heart size={14} fill={post.liked ? '#f87171' : 'none'} />
          <span>{post.likes}</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
          style={{ color: 'var(--text-dim)' }}
        >
          <MessageCircle size={14} />
          <span>{post.comments}</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ml-auto transition-colors"
          style={{ color: 'var(--text-dim)' }}
        >
          <Share2 size={14} />
        </button>
      </div>
    </div>
  );
}

function CreatePostBox({ ka, userName, userInitials }: { ka: boolean; userName: string; userInitials: string }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [type, setType] = useState<PostType>('observation');
  const [showImageInput, setShowImageInput] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) textRef.current?.focus();
  }, [open]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-left transition-colors"
        style={{
          background: 'rgba(15,31,61,0.55)',
          border: '1px solid rgba(56,240,255,0.12)',
          color: 'var(--text-dim)',
        }}
      >
        <Avatar initials={userInitials} color="#38F0FF" />
        <span>{ka ? 'დაწერე პოსტი...' : 'Share an observation or story...'}</span>
      </button>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: 'rgba(15,31,61,0.70)', border: '1px solid rgba(56,240,255,0.18)' }}
    >
      <div className="flex items-center gap-3">
        <Avatar initials={userInitials} color="#38F0FF" />
        <span className="text-sm font-semibold flex-1">{userName}</span>
        <button onClick={() => { setOpen(false); setContent(''); setImageUrl(''); }} style={{ color: 'var(--text-dim)' }}>
          <X size={16} />
        </button>
      </div>

      {/* Type selector */}
      <div className="flex gap-1.5 flex-wrap">
        {(Object.keys(POST_TYPE_CONFIG) as PostType[]).map(t => {
          const cfg = POST_TYPE_CONFIG[t];
          const active = type === t;
          return (
            <button
              key={t}
              onClick={() => setType(t)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors"
              style={{
                color: active ? cfg.color : 'var(--text-dim)',
                background: active ? `${cfg.color}15` : 'transparent',
                border: `1px solid ${active ? cfg.color + '40' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {cfg.icon}
              {ka ? cfg.label_ka : cfg.label_en}
            </button>
          );
        })}
      </div>

      <textarea
        ref={textRef}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={ka ? 'გააზიარე შენი დაკვირვება, ფოტო ან კითხვა...' : 'Share your observation, photo, or question...'}
        rows={3}
        className="w-full text-sm resize-none outline-none rounded-xl px-3 py-2.5 leading-relaxed"
        style={{
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(56,240,255,0.10)',
          color: 'var(--text-primary)',
        }}
      />

      {showImageInput && (
        <input
          type="url"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          placeholder={ka ? 'სურათის ბმული (URL)...' : 'Image URL...'}
          className="w-full text-xs outline-none rounded-xl px-3 py-2"
          style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(56,240,255,0.10)',
            color: 'var(--text-primary)',
          }}
        />
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowImageInput(v => !v)}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: showImageInput ? '#38F0FF' : 'var(--text-dim)' }}
        >
          <Image size={16} />
        </button>
        <button
          disabled={!content.trim()}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          style={{
            background: content.trim() ? 'rgba(56,240,255,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${content.trim() ? 'rgba(56,240,255,0.30)' : 'rgba(255,255,255,0.08)'}`,
            color: content.trim() ? '#38F0FF' : 'var(--text-dim)',
          }}
        >
          <Send size={12} />
          {ka ? 'გაგზავნა' : 'Post'}
        </button>
      </div>
    </div>
  );
}

const FILTER_TYPES = ['all', 'observation', 'photo', 'discussion', 'news'] as const;
type FilterType = typeof FILTER_TYPES[number];

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-8" />}>
      <FeedPage />
    </Suspense>
  );
}

function FeedPage() {
  const { user } = useAuth();
  const { locale } = useLanguage();
  const ka = locale === 'ka';
  const searchParams = useSearchParams();
  const q = searchParams.get('q')?.toLowerCase() ?? '';

  const [posts, setPosts] = useState<FeedPost[]>(DEMO_POSTS);
  const [filter, setFilter] = useState<FilterType>('all');

  const displayName: string =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Observer';
  const userInitials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  function handleLike(id: string) {
    setPosts(prev => prev.map(p =>
      p.id === id
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  }

  const filtered = posts.filter(p => {
    if (filter !== 'all' && p.type !== filter) return false;
    if (q) return p.content.toLowerCase().includes(q) || p.user_name.toLowerCase().includes(q);
    return true;
  });

  const filterLabel: Record<FilterType, { en: string; ka: string }> = {
    all:         { en: 'All',          ka: 'ყველა' },
    observation: { en: 'Observations', ka: 'დაკვირვებები' },
    photo:       { en: 'Photos',       ka: 'ფოტოები' },
    discussion:  { en: 'Discussions',  ka: 'განხილვები' },
    news:        { en: 'News',         ka: 'სიახლეები' },
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-page-enter flex flex-col gap-5">

      {/* Header */}
      <div className="text-center mb-1">
        <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-2">— SkyWatcher —</p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
          {ka ? 'ფიდი' : 'Feed'}
        </h1>
        {q && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-dim)' }}>
            {ka ? `ძიება: "${q}"` : `Search: "${q}"`}
          </p>
        )}
      </div>

      {/* Create post */}
      {user && (
        <CreatePostBox ka={ka} userName={displayName} userInitials={userInitials} />
      )}

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        {FILTER_TYPES.map(f => {
          const active = filter === f;
          const cfg = f !== 'all' ? POST_TYPE_CONFIG[f as PostType] : null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: active ? 'rgba(56,240,255,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? 'rgba(56,240,255,0.30)' : 'rgba(255,255,255,0.08)'}`,
                color: active ? '#38F0FF' : 'var(--text-dim)',
              }}
            >
              {cfg && cfg.icon}
              {ka ? filterLabel[f].ka : filterLabel[f].en}
            </button>
          );
        })}
      </div>

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-dim)' }}>
          <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{ka ? 'პოსტები ვერ მოიძებნა' : 'No posts found'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(post => (
            <PostCard key={post.id} post={post} ka={ka} onLike={handleLike} />
          ))}
        </div>
      )}
    </div>
  );
}
