import { SITE } from "@/lib/site-config";

export default function Hero() {
  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];

  const trustPoints = [
    { label: "Flat Fee", value: SITE.priceDisplay },
    { label: "Delivery", value: "5 Working Days" },
    { label: "Built For", value: "Mobile + SEO" },
    { label: "Serving", value: "Kerala & India" },
  ];

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-line bg-[linear-gradient(90deg,theme(colors.line)_1px,transparent_1px)] bg-[size:60px_100%]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-bg-panel/70 via-transparent to-bg pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 pt-40 pb-24">
        <div className="corner-brackets inline-flex items-center gap-2 px-3 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-coral rounded-full animate-pulse-dot" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
            Affordable Website Design, Kerala &amp; India
          </span>
        </div>

        <h1 className="font-display font-semibold text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05] tracking-tight max-w-4xl">
          A Website That Actually
          <br />
          <span className="text-navy">Brings You Customers</span> Live in
          5 Days.
        </h1>

        <p className="mt-6 max-w-xl text-ink-muted text-lg leading-relaxed">
          {SITE.name} builds fast, mobile-first, search-friendly websites for
          small businesses across Kerala and India no bloated CMS, no
          hidden costs, no long agency timelines. Just a professional site
          for a flat fee of{" "}
          <span className="text-ink font-medium">{SITE.priceDisplay}</span>.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#intake"
            className="font-mono text-sm uppercase tracking-widest bg-coral text-coral-ink px-6 py-3.5 border border-coral hover:bg-bg-invert hover:text-invert-ink hover:border-bg-invert transition-colors"
          >
            Get Your Website Built →
          </a>
          <a
            href={`https://wa.me/${SITE.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm uppercase tracking-widest px-6 py-3.5 border border-line-strong text-ink hover:border-navy hover:text-navy transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Trust strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line">
          {trustPoints.map((t) => (
            <div key={t.label} className="bg-bg px-5 py-4">
              <div className="font-display font-semibold text-lg text-ink">
                {t.value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mt-1">
                {t.label}
              </div>
            </div>
          ))}
        </div>

        {/* Build status strip — signature element */}
        <div className="mt-8 border border-line bg-bg-panel/50 px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              Build status
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              Day 1 → Day 5
            </span>
          </div>
          <div className="relative">
            <div className="h-px w-full bg-line-strong" />
            <div className="h-px w-1/5 bg-coral absolute top-0 left-0" />
            <div className="flex justify-between mt-[-1px]">
              {days.map((d, i) => (
                <div key={d} className="flex flex-col items-center gap-2">
                  <span
                    className={`w-2 h-2 rotate-45 ${
                      i === 0 ? "bg-coral" : "bg-line-strong"
                    }`}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                    {d}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}