import { SITE } from "@/lib/site-config";

const timeline = [
  { day: "Day 1", label: "Brief" },
  { day: "Day 2–3", label: "Build" },
  { day: "Day 4", label: "Review" },
  { day: "Day 5", label: "Launch" },
];

const bullets = [
  "Bespoke, mobile-first website",
  "5-day delivery window",
  "On-page SEO setup included",
  "WhatsApp & call button integration",
];

export default function Offer() {
  return (
    <section id="offer" className="border-b border-line grid-dots">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
          Pricing
        </span>
        <h2 className="mt-4 font-display font-semibold text-3xl md:text-4xl max-w-2xl leading-tight">
          One flat fee. Five working days. No surprises.
        </h2>
        <p className="mt-4 max-w-xl text-ink-muted leading-relaxed">
          A complete, launch-ready website — content structure, layout,
          mobile optimization, on-page SEO, and deployment included. Domain
          registration is billed separately at cost, so you always know
          exactly what you&apos;re paying for.
        </p>

        <div className="mt-14 grid md:grid-cols-[1fr_auto] gap-8 items-stretch">
          {/* Timeline */}
          <div className="border border-line bg-bg-panel/50 p-8">
            <div className="grid grid-cols-4 gap-4">
              {timeline.map((t, i) => (
                <div key={t.day} className="relative">
                  <div className="font-mono text-[10px] text-ink-faint mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="h-1 bg-line-strong mb-3 relative overflow-hidden">
                    <div
                      className="h-full bg-coral absolute inset-y-0 left-0"
                      style={{ width: i === 0 ? "100%" : "0%" }}
                    />
                  </div>
                  <div className="font-mono text-xs uppercase tracking-wider text-navy">
                    {t.day}
                  </div>
                  <div className="font-display text-sm mt-1 text-ink">
                    {t.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price card — inverted "spec sheet" signature moment */}
          <div className="border border-bg-invert bg-bg-invert text-invert-ink p-8 w-full md:w-80 flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              Flat fee
            </span>
            <div className="mt-2 font-display font-semibold text-5xl">
              {SITE.priceDisplay}
            </div>
            <span className="font-mono text-[11px] text-ink-faint mt-1">
              domain billed separately
            </span>

            <ul className="mt-8 space-y-3 flex-1">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <span className="text-coral font-mono">—</span>
                  {b}
                </li>
              ))}
            </ul>

            <a
              href="#intake"
              className="mt-8 text-center font-mono text-sm uppercase tracking-widest bg-coral text-coral-ink px-6 py-3.5 border border-coral hover:bg-transparent hover:text-coral transition-colors"
            >
              Pre-Order Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
