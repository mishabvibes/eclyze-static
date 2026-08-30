import { SITE } from "@/lib/site-config";

const rows = [
  { label: "Starting cost", eclyze: SITE.priceDisplay, agency: "₹25,000+", diy: "Free–₹3,000/yr" },
  { label: "Time to launch", eclyze: "5 days", agency: "3–6 weeks", diy: "Weekends, indefinitely" },
  { label: "Mobile-first design", eclyze: "Included", agency: "Sometimes extra", diy: "Depends on template" },
  { label: "On-page SEO setup", eclyze: "Included", agency: "Often a separate package", diy: "You configure it" },
  { label: "Who builds it", eclyze: "A dedicated developer", agency: "A account manager + team", diy: "You" },
  { label: "WhatsApp / call CTA", eclyze: "Built in", agency: "Custom request", diy: "Manual setup" },
];

export default function WhyUs() {
  return (
    <section className="border-b border-line bg-bg-panel/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
          The Comparison
        </span>
        <h2 className="mt-4 font-display font-semibold text-3xl md:text-4xl max-w-2xl leading-tight">
          Agency quality, without the agency price or wait.
        </h2>
        <p className="mt-4 max-w-xl text-ink-muted leading-relaxed">
          Most small businesses in Kerala end up choosing between an
          expensive agency or a DIY builder that never quite gets finished.
          {SITE.name} sits in between built by a professional, priced for
          a small business.
        </p>

        <div className="mt-14 overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-line-strong text-left">
                <th className="py-4 pr-4 font-mono text-[11px] uppercase tracking-widest text-ink-faint font-normal">
                  &nbsp;
                </th>
                <th className="py-4 px-4 font-display font-semibold text-navy">
                  {SITE.name}
                </th>
                <th className="py-4 px-4 font-display font-medium text-ink-muted">
                  Typical Agency
                </th>
                <th className="py-4 px-4 font-display font-medium text-ink-muted">
                  DIY Builder
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-line">
                  <td className="py-4 pr-4 text-sm text-ink-muted">
                    {r.label}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-ink bg-coral/10">
                    {r.eclyze}
                  </td>
                  <td className="py-4 px-4 text-sm text-ink-muted">
                    {r.agency}
                  </td>
                  <td className="py-4 px-4 text-sm text-ink-muted">
                    {r.diy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
