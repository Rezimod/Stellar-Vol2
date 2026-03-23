import Link from 'next/link';
import AstroLogo from './AstroLogo';

export default function Footer() {
  return (
    <footer
      className="relative z-10 mt-auto"
      style={{
        background: 'rgba(7,11,20,0.6)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid transparent',
        borderImage: 'linear-gradient(to right, transparent, rgba(255,209,102,0.2), rgba(56,240,255,0.25), rgba(255,209,102,0.2), transparent) 1',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <AstroLogo heightClass="h-5" />
            <div className="ornament-line w-16 hidden sm:block" />
            <span className="text-[10px] text-[var(--text-dim)] tracking-widest font-mono">STELLAR V2</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-[var(--text-dim)]">
            <Link href="/"       className="hover:text-[#FFD166] transition-colors">Home</Link>
            <Link href="/create" className="hover:text-[#FFD166] transition-colors">Name a Star</Link>
            <Link href="/blog"   className="hover:text-[#FFD166] transition-colors">Blog</Link>
            <a href="https://astroman.ge" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD166] transition-colors">Store</a>
            <a href="https://stellar.org"  target="_blank" rel="noopener noreferrer" className="hover:text-[#38F0FF] transition-colors">Stellar</a>
          </div>

        </div>
        <p className="text-center text-[10px] text-[var(--text-dim)]/40 mt-4">
          © {new Date().getFullYear()} Astroman — Built with love in Tbilisi
        </p>
      </div>
    </footer>
  );
}
