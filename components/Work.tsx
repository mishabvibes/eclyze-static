const projects = [
  {
    name: "Café Rosette",
    category: "Food & Beverage",
    blurb: "Menu, gallery, and table-booking WhatsApp link for a specialty coffee bar.",
    url: "caferosette.eclyze.site",
    accent: "coral" as const,
    layout: "hero-grid" as const,
  },
  {
    name: "Nila Boutique",
    category: "Retail / Fashion",
    blurb: "Lookbook-style product gallery built to move browsers straight to Instagram DMs.",
    url: "nilaboutique.eclyze.site",
    accent: "navy" as const,
    layout: "gallery" as const,
  },
  {
    name: "Kochi Fitness Lab",
    category: "Fitness Studio",
    blurb: "Class schedule, trainer bios, and a single conversion-first membership CTA.",
    url: "kochifitnesslab.eclyze.site",
    accent: "coral" as const,
    layout: "list" as const,
  },
];

function BrowserMockup({
  accent,
  layout,
  url,
}: {
  accent: "coral" | "navy";
  layout: "hero-grid" | "gallery" | "list";
  url: string;
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
          {url}
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
          Recently shipped, five days at a time.
        </h2>
        <p className="mt-4 max-w-xl text-ink-muted leading-relaxed">
          A sample of builds delivered on the standard flat-fee timeline —
          each one live, mobile-first, and tuned for its business.
        </p>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.name} className="group corner-brackets flex flex-col">
              <BrowserMockup
                accent={p.accent}
                layout={p.layout}
                url={p.url}
              />
              <div className="mt-5 flex items-baseline justify-between">
                <h3 className="font-display font-medium text-lg">
                  {p.name}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-navy">
                  {p.category}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                {p.blurb}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 font-mono text-[11px] text-ink-faint">
          — sample builds shown for illustration. Swap in real client
          projects here.
        </p>
      </div>
    </section>
  );
}