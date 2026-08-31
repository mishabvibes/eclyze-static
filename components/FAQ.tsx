import { faqs } from "@/lib/faq-data";

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
              <h3 className="font-display-alt font-medium text-base text-ink">
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