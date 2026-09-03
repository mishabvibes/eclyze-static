import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntakeForm from "@/components/IntakeForm";
import ChatWidget from "@/components/ChatWidgetLoader";
import { SITE } from "@/lib/site-config";

// NOTE: `title` is the bare page title — the root layout's metadata.title.template
// ("%s | Eclyze") appends the brand suffix automatically for the <title> tag.
// Don't add "| Eclyze" here, or it renders twice ("... | Eclyze | Eclyze").
// `fullTitle` is only for surfaces that don't go through that template
// (Open Graph / Twitter Card), so social shares still show the branded title.
const title = "Website Cost in Kerala — 2026 Pricing Guide";
const fullTitle = `${title} | ${SITE.name}`;
const description =
  "How much does a website cost in Kerala? A straight breakdown of DIY builders, freelancers, agencies, and Eclyze's flat ₹9,999 mobile-first website — no hidden fees.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "website cost Kerala",
    "website design cost Kerala",
    "how much does a website cost in Kerala",
    "affordable website price India",
    "cheap website design Kerala",
  ],
  alternates: { canonical: "/website-cost-kerala" },
  openGraph: { title: fullTitle, description, url: `${SITE.domain}/website-cost-kerala`, type: "website" },
  twitter: { title: fullTitle, description },
};

const rows = [
  {
    option: "DIY website builder",
    cost: "₹0 – ₹3,000/yr",
    note: "Cheapest, but you build & maintain it yourself. Generic templates.",
  },
  {
    option: "Freelance developer",
    cost: "₹5,000 – ₹15,000",
    note: "Price and quality vary a lot. Timelines often slip.",
  },
  {
    option: "Local web agency",
    cost: "₹20,000 – ₹60,000+",
    note: "Polished, but slower and pricier — often overkill for a small business.",
  },
  {
    option: "Eclyze",
    cost: "₹9,999 flat",
    note: "Mobile-first, SEO-ready, 5-day delivery. Domain billed separately at cost.",
  },
];

const included = [
  "Custom, mobile-first design (not a template)",
  "On-page SEO setup — titles, metadata, semantic HTML",
  "WhatsApp & call button integration",
  "Optional built-in AI chat assistant",
  "5 working days from brief to launch",
];

export default function WebsiteCostKerala() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="border-b border-line grid-dots">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              Pricing Guide
            </span>
            <h1 className="mt-4 font-display font-semibold text-3xl md:text-5xl max-w-2xl leading-tight">
              How much does a website actually cost in Kerala?
            </h1>
            <p className="mt-4 text-ink-muted max-w-xl leading-relaxed">
              Prices for a small-business website in Kerala range from
              free DIY builders to ₹60,000+ agency projects. Here&apos;s an
              honest breakdown, and where Eclyze fits in.
            </p>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <div className="overflow-x-auto border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line-strong text-left bg-bg-panel/40">
                    <th className="font-mono text-[11px] uppercase tracking-wider text-ink-faint px-5 py-4">
                      Option
                    </th>
                    <th className="font-mono text-[11px] uppercase tracking-wider text-ink-faint px-5 py-4">
                      Typical Cost
                    </th>
                    <th className="font-mono text-[11px] uppercase tracking-wider text-ink-faint px-5 py-4">
                      Reality
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.option}
                      className={`border-b border-line last:border-b-0 ${
                        r.option === "Eclyze" ? "bg-bg-panel/40" : ""
                      }`}
                    >
                      <td className="px-5 py-4 font-display-alt font-medium text-ink whitespace-nowrap">
                        {r.option}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-navy whitespace-nowrap">
                        {r.cost}
                      </td>
                      <td className="px-5 py-4 text-ink-muted leading-relaxed">
                        {r.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-sm text-ink-faint max-w-2xl leading-relaxed">
              Domain registration (roughly ₹500–₹1,500/year depending on
              the extension) is billed separately at cost in every case —
              no one, including us, includes that in a website fee.
            </p>
          </div>
        </section>

        <section className="border-b border-line bg-bg-panel/40">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              What ₹9,999 Includes
            </span>
            <h2 className="mt-4 font-display font-semibold text-2xl sm:text-3xl max-w-xl leading-tight">
              No hidden charges. Here&apos;s exactly what&apos;s in the flat fee.
            </h2>

            <ul className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-4 max-w-2xl">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 text-coral font-mono text-sm shrink-0">
                    —
                  </span>
                  <span className="text-sm sm:text-[15px] text-ink leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="#intake"
              className="mt-10 inline-block font-mono text-sm uppercase tracking-widest bg-coral text-coral-ink px-6 py-3.5 border border-coral hover:bg-bg-invert hover:text-invert-ink hover:border-bg-invert transition-colors"
            >
              Get Your Website — {SITE.priceDisplay}
            </a>
          </div>
        </section>

        <IntakeForm />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
