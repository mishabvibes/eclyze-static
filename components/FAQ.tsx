import { SITE } from "@/lib/site-config";

const faqs = [
  {
    q: "How much does a website cost in Kerala?",
    a: `Website pricing in Kerala usually ranges from a few thousand rupees for a DIY builder to ₹25,000+ for a full agency build. ${SITE.name} offers a flat, all-inclusive fee of ${SITE.priceDisplay} for a professional, mobile-first website — no hidden charges beyond domain registration.`,
  },
  {
    q: "How fast can you actually deliver a website?",
    a: "Five working days from the day you share your business details and content. Day 1 is your brief, Days 2–3 are the build, Day 4 is review, and Day 5 is launch.",
  },
  {
    q: "Do I need to buy hosting and a domain separately?",
    a: "Domain registration is billed separately at cost, since prices vary by domain name and extension. If you don't have a domain yet, we'll help you pick and register one — or set you up on a free Eclyze subdomain to start.",
  },
  {
    q: "Will my website work well on mobile phones?",
    a: "Yes — every Eclyze website is built mobile-first, since most customers in Kerala and across India browse and search on their phones first.",
  },
  {
    q: "Will my website show up on Google search?",
    a: "Every site ships with on-page SEO basics done right: clean semantic HTML, fast load times, proper page titles and meta descriptions, and mobile-friendliness — the technical foundation Google looks for. Ranking well over time also depends on your content, competition, and location, but the groundwork is built in from day one.",
  },
  {
    q: "Do you work with businesses outside Kerala?",
    a: "Yes. Eclyze is based in Kerala and works with businesses across India — the entire process, from brief to launch, happens over WhatsApp and call, so location isn't a barrier.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
          Frequently Asked
        </span>
        <h2 className="mt-4 font-display font-semibold text-3xl md:text-4xl max-w-2xl leading-tight">
          Questions Kerala businesses ask us most.
        </h2>

        <div className="mt-14 grid md:grid-cols-2 gap-px bg-line border border-line">
          {faqs.map((f) => (
            <div key={f.q} className="bg-bg p-6">
              <h3 className="font-display font-medium text-base text-ink">
                {f.q}
              </h3>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQPage structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
              },
            })),
          }),
        }}
      />
    </section>
  );
}