const features = [
  {
    index: "01",
    tag: "Mobile-First",
    title: "Built for the palm of a hand.",
    desc: "Most of your customers in Kerala and across India are searching on their phone. Every layout starts at 375px and scales up from there.",
  },
  {
    index: "02",
    tag: "Search-Ready",
    title: "Found on Google, not just online.",
    desc: "Clean semantic markup, fast load times, and proper metadata from day one the technical SEO foundation most budget websites skip.",
  },
  {
    index: "03",
    tag: "Conversion-Ready",
    title: "Designed to close, not just look good.",
    desc: "Every section is placed with intent CTAs, trust signals, and a clear path to WhatsApp or a call, tuned to turn visits into leads.",
  },
];

export default function Standard() {
  return (
    <section id="standard" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
          Why Businesses Choose Eclyze
        </span>
        <h2 className="mt-4 font-display font-semibold text-3xl md:text-4xl max-w-2xl leading-tight">
          No bloated CMS. No plugin debt. Just a website engineered to
          actually get you customers.
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-px bg-line border border-line">
          {features.map((f) => (
            <div key={f.index} className="bg-bg p-8 flex flex-col gap-6">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs text-ink-faint">
                  {f.index} /
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-navy">
                  {f.tag}
                </span>
              </div>
              <h3 className="font-display-alt font-medium text-xl leading-snug">
                {f.title}
              </h3>
              <p className="text-ink-muted text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}