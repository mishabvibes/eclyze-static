const projects = [
  {
    name: "Dihana Febin",
    category: "Portfolio",
    blurb:
      "A bold digital-marketer portfolio blending SEO expertise, Meta Ads, and visual design into a high-conversion personal brand.",
    url: "https://dihanafebin.vercel.app",
    displayUrl: "dihanafebin.vercel.app",
    accent: "navy" as const,
    layout: "hero-grid" as const,
  },
  {
    name: "AIC Amal",
    category: "Donation Platform",
    blurb:
      "A full-featured donation platform for Akode Islamic Centre — supporting community campaigns, agent portals, and seamless UPI payments.",
    url: "https://aicamal.app",
    displayUrl: "aicamal.app",
    accent: "coral" as const,
    layout: "gallery" as const,
  },
  {
    name: "Rahath Ayurvedic",
    category: "Local Business",
    blurb:
      "SEO-optimised storefront for a traditional Ayurvedic shop in Mannarkkad — bilingual content, Google Reviews, and enquiry-first UX.",
    url: "https://rahathayurvedic.vercel.app",
    displayUrl: "rahathayurvedic.vercel.app",
    accent: "navy" as const,
    layout: "list" as const,
  },
];

function BrowserMockup({
  accent,
  layout,
  displayUrl,
}: {
  accent: "coral" | "navy";
  layout: "hero-grid" | "gallery" | "list";
  displayUrl: string;
}) {
  const solid = accent === "coral" ? "bg-coral" : "bg-navy";
  const tint = accent === "coral" ? "bg-coral/40" : "bg-navy/25";

  return (
    <div className="border border-line bg-bg overflow-hidden">
      {/* Chrome */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-line bg-bg-panel">
        <span className="w-2 h-2 rounded-full bg-line-strong" />
        <span className="w-2 h-2 rounded-full bg-line-strong" />
        <span className={`w-2 h-2 rounded-full ${solid}`} />
        <span className="ml-2 font-mono text-[10px] text-ink-faint truncate">
          {displayUrl}
        </span>
      </div>

      {/* Abstract layout preview */}
      <div className="p-4 space-y-2">
        {layout === "hero-grid" && (
          <>
            <div className="h-14 bg-bg-panel border border-line" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-8 bg-bg-panel border border-line" />
              <div className={`h-8 border border-line ${tint}`} />
              <div className="h-8 bg-bg-panel border border-line" />
            </div>
          </>
        )}
        {layout === "gallery" && (
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-9 border border-line ${
                  i === 1 || i === 4 ? tint : "bg-bg-panel"
                }`}
              />
            ))}
          </div>
        )}
        {layout === "list" && (
          <>
            <div className="h-10 bg-bg-panel border border-line" />
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-6 bg-bg-panel border border-line flex items-center px-2 gap-2"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    i === 0 ? solid : "bg-line-strong"
                  }`}
                />
                <span className="h-1 flex-1 bg-line-strong" />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default function Work() {
  return (
    <section id="work" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
          Selected Work
        </span>
        <h2 className="mt-4 font-display font-semibold text-3xl md:text-4xl max-w-2xl leading-tight">
          Real builds. Real businesses. Live now.
        </h2>
        <p className="mt-4 max-w-xl text-ink-muted leading-relaxed">
          Every project below is a live website we shipped — mobile-first,
          SEO-ready, and built to convert.
        </p>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.name} className="group corner-brackets flex flex-col">
              <BrowserMockup
                accent={p.accent}
                layout={p.layout}
                displayUrl={p.displayUrl}
              />
              <div className="mt-5 flex items-baseline justify-between">
                <h3 className="font-display font-medium text-lg">
                  {p.name}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-navy">
                  {p.category}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed flex-1">
                {p.blurb}
              </p>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink border border-line-strong px-4 py-2.5 hover:border-navy hover:text-navy transition-colors self-start"
              >
                Explore Site
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}