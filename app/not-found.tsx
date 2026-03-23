import Link from 'next/link';
import { Star } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center animate-page-enter">
      <Star size={48} className="mx-auto mb-6 animate-float" style={{ color: '#FFD166', opacity: 0.6 }} />
      <h1
        className="text-3xl font-bold mb-3"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Star Not Found
      </h1>
      <p className="text-[var(--text-secondary)] text-sm mb-8">
        This star doesn't exist in our registry — or hasn't been named yet.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
        <Link href="/" className="btn-ghost px-6 py-3 rounded-xl text-sm">
          Back to Home
        </Link>
        <Link href="/create" className="btn-stellar px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
          <Star size={14} />
          Name a Star
        </Link>
      </div>
    </div>
  );
}
