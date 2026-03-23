import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/constants';
import { Clock, ArrowLeft, Tag } from 'lucide-react';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} — Astroman Blog`,
    description: post.excerpt,
  };
}

function renderContent(md: string) {
  // Minimal markdown → HTML (h2, h3, p, ul/li)
  const lines = md.trim().split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length) {
      elements.push(
        <ul key={key} className="list-none flex flex-col gap-2 my-4">
          {listItems.map((li, i) => (
            <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)] text-sm leading-relaxed">
              <span style={{ color: '#FFD166' }}>✦</span>
              {li}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith('## ')) {
      flushList(`fl-${i}`);
      elements.push(
        <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList(`fl-${i}`);
      elements.push(
        <h3 key={i} className="text-base font-semibold text-[#FFD166] mt-5 mb-2">{line.slice(4)}</h3>
      );
    } else if (line.startsWith('- ')) {
      listItems.push(line.slice(2));
    } else if (line.startsWith('**') && line.endsWith('**')) {
      flushList(`fl-${i}`);
      elements.push(
        <p key={i} className="text-white font-semibold text-sm my-2">{line.slice(2, -2)}</p>
      );
    } else if (line.trim()) {
      flushList(`fl-${i}`);
      // Handle inline links [text](url)
      const linkified = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" class="text-[#38F0FF] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>`);
      elements.push(
        <p key={i} className="text-[var(--text-secondary)] text-sm leading-relaxed my-2"
           dangerouslySetInnerHTML={{ __html: linkified }} />
      );
    } else {
      flushList(`fl-${i}`);
    }
  });
  flushList('final');
  return elements;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-page-enter">

      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-[var(--text-dim)] hover:text-[var(--text-secondary)] text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        All posts
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">{post.cover_emoji}</span>
          <span
            className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,209,102,0.08)', color: '#FFD166', border: '1px solid rgba(255,209,102,0.2)' }}
          >
            <Tag size={9} className="inline mr-1" />
            {post.category}
          </span>
        </div>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 leading-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {post.title}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">{post.excerpt}</p>
        <div className="flex items-center gap-4 text-xs text-[var(--text-dim)]">
          <span className="flex items-center gap-1"><Clock size={11} /> {post.read_time} min read</span>
          <span>{post.date}</span>
        </div>
      </div>

      <div className="ornament-line mb-8" />

      {/* Content */}
      <article className="prose-sm">
        {post.content
          ? renderContent(post.content)
          : <p className="text-[var(--text-secondary)] text-sm">Full article coming soon.</p>
        }
      </article>

      <div className="ornament-line mt-10 mb-8" />

      {/* Related */}
      <div>
        <p className="text-[var(--text-dim)] text-xs tracking-widest uppercase mb-5">— More Articles —</p>
        <div className="flex flex-col gap-3">
          {related.map(r => (
            <Link key={r.slug} href={`/blog/${r.slug}`} className="group">
              <div className="glass-card px-4 py-3 flex items-center gap-3">
                <span className="text-xl">{r.cover_emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium group-hover:text-[#FFD166] transition-colors truncate">
                    {r.title}
                  </p>
                  <p className="text-[var(--text-dim)] text-[10px] flex items-center gap-1 mt-0.5">
                    <Clock size={9} /> {r.read_time} min · {r.date}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
