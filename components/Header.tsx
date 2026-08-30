import Link from "next/link";
import { SITE } from "@/lib/site-config";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-semibold text-lg tracking-tight text-ink"
        >
          {SITE.name}
          <span className="text-navy">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-ink-muted">
          <Link href="/#standard" className="hover:text-navy transition-colors">
            Why Eclyze
          </Link>
          <Link href="/#work" className="hover:text-navy transition-colors">
            Work
          </Link>
          <Link href="/#offer" className="hover:text-navy transition-colors">
            Pricing
          </Link>
          <Link href="/#faq" className="hover:text-navy transition-colors">
            FAQ
          </Link>
          <Link href="/blog" className="hover:text-navy transition-colors">
            Blog
          </Link>
          <Link href="/#intake" className="hover:text-navy transition-colors">
            Start Project
          </Link>
        </nav>

        <Link
          href="/#intake"
          className="font-mono text-xs uppercase tracking-widest bg-coral text-coral-ink px-4 py-2 border border-coral hover:bg-bg-invert hover:text-invert-ink hover:border-bg-invert transition-colors"
        >
          Get a Website — {SITE.priceDisplay}
        </Link>
      </div>
    </header>
  );
}
