import { SITE } from "@/lib/site-config";

const timeline = [
  {
    day: "Day 1",
    label: "Brief",
    desc: "We collect your business details, content, and goals.",
  },
  {
    day: "Day 2–3",
    label: "Build",
    desc: "Your site takes shape — layout, copy, and mobile-first design.",
  },
  {
    day: "Day 4",
    label: "Review",
    desc: "You review the build and request any changes.",
  },
  {
    day: "Day 5",
    label: "Launch",
    desc: "Final polish, deployment, and you're live.",
  },
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
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
          {/* Left column — eyebrow, heading, paragraph, timeline */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              Pricing
            </span>
            <h2 className="mt-4 font-display font-semibold text-3xl md:text-4xl max-w-2xl leading-tight">
              One flat fee. Five working days. No surprises.
            </h2>
            <p className="mt-4 max-w-xl text-ink-muted leading-relaxed">
              A complete, launch-ready website content structure, layout,
              mobile optimization, on-page SEO, and deployment included.
              Domain registration is billed separately at cost, so you
              always know exactly what you&apos;re paying for.
            </p>

            {/* Timeline — simple single-line, no hover complexity */}
            <div className="mt-14 flex flex-wrap items-center gap-x-3 gap-y-4">
              {timeline.map((t, i) => (
                <div key={t.day} className="flex items-center gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        i < 2 ? "bg-coral" : "bg-line-strong"
                      }`}
                    />
                    <span className="font-mono text-xs">
                      <span className="text-navy uppercase tracking-wider">
                        {t.day}
                      </span>
                      <span className="text-ink-faint mx-1.5">·</span>
                      <span className="text-ink font-medium">{t.label}</span>
                    </span>
                  </div>
                  {i !== timeline.length - 1 && (
                    <span className="w-6 sm:w-10 h-px bg-line-strong" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right column — price card, top-aligned with the heading */}
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

            <ul className="mt-8 space-y-3">
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