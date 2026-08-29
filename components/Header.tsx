import { SITE } from "@/lib/site-config";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a
          href="#top"
          className="font-display font-semibold text-lg tracking-tight text-ink"
        >
          {SITE.name}
          <span className="text-coral">.</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-ink-muted">
          <a href="#standard" className="hover:text-coral transition-colors">
            Why Eclyze
          </a>
          <a href="#work" className="hover:text-coral transition-colors">
            Work
          </a>
          <a href="#offer" className="hover:text-coral transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-coral transition-colors">
            FAQ
          </a>
          <a href="#intake" className="hover:text-coral transition-colors">
            Start Project
          </a>
        </nav>

        <a
          href="#intake"
          className="font-mono text-xs uppercase tracking-widest bg-coral text-coral-ink px-4 py-2 border border-coral hover:bg-transparent hover:text-coral transition-colors"
        >
          Get a Website — {SITE.priceDisplay}
        </a>
      </div>
    </header>
  );
}
