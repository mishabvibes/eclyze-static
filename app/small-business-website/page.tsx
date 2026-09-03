import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntakeForm from "@/components/IntakeForm";
import ChatWidget from "@/components/ChatWidgetLoader";
import { SITE } from "@/lib/site-config";

// NOTE: `title` is the bare page title — the root layout's metadata.title.template
// ("%s | Eclyze") appends the brand suffix automatically for the <title> tag.
// Don't add "| Eclyze" here, or it renders twice ("... | Eclyze | Eclyze").
const title = "Website for Small Business in Kerala & India";
const fullTitle = `${title} | ${SITE.name}`;
const description =
  "A mobile-first, SEO-ready website built specifically for small businesses in Kerala and across India shops, clinics, restaurants, and service providers. Flat ₹9,999, live in 5 days.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "small business website Kerala",
    "small business website India",
    "website for small business",
    "affordable website for shop owners",
    "website design for local business",
  ],
  alternates: { canonical: "/small-business-website" },
  openGraph: { title: fullTitle, description, url: `${SITE.domain}/small-business-website`, type: "website" },
  twitter: { title: fullTitle, description },
};

const businessTypes = [
  "Shops & retail stores",
  "Clinics & healthcare providers",
  "Restaurants & cafés",
  "Salons & spas",
  "Tuition centres & coaching institutes",
  "Contractors & home services",
];

const why = [
  {
    tag: "You don't need e-commerce",
    text: "Most small businesses just need customers to find them, trust them, and reach out. A focused site with a clear WhatsApp/call path converts better than a bloated online store you'll never fully use.",
  },
  {
    tag: "You don't need a monthly bill",
    text: "No CMS subscription, no plugin licenses, no \"maintenance retainer.\" One flat fee, and the site is yours.",
  },
  {
    tag: "You don't need to wait weeks",
    text: "5 working days from sharing your business details to going live — most agencies quote 3–6 weeks for the same thing.",
  },
];

export default function SmallBusinessWebsite() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="border-b border-line grid-dots">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              For Small Businesses
            </span>
            <h1 className="mt-4 font-display font-semibold text-3xl md:text-5xl max-w-2xl leading-tight">
              A website built for how small businesses in Kerala &amp;
              India actually work.
            </h1>
            <p className="mt-4 text-ink-muted max-w-xl leading-relaxed">
              Not a generic template. Not a bloated CMS you'll never
              touch again. A fast, mobile-first site that gets a
              customer from &quot;found you on Google&quot; to
              &quot;messaged you on WhatsApp&quot; in one visit.
            </p>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              Who This Is For
            </span>
            <h2 className="mt-4 font-display font-semibold text-2xl sm:text-3xl max-w-xl leading-tight">
              If your customers search for you online, this is for you.
            </h2>

            <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-line border border-line">
              {businessTypes.map((b) => (
                <div key={b} className="bg-bg p-6">
                  <span className="text-sm font-display-alt font-medium text-ink">
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line bg-bg-panel/40">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              Why Small Businesses Choose Eclyze
            </span>
            <div className="mt-10 space-y-10 max-w-2xl">
              {why.map((w) => (
                <div key={w.tag} className="flex flex-col gap-2">
                  <h3 className="font-display-alt font-medium text-lg text-ink">
                    {w.tag}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-ink-muted leading-relaxed">
                    {w.text}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="#intake"
              className="mt-12 inline-block font-mono text-sm uppercase tracking-widest bg-coral text-coral-ink px-6 py-3.5 border border-coral hover:bg-bg-invert hover:text-invert-ink hover:border-bg-invert transition-colors"
            >
              Start Your Website — {SITE.priceDisplay}
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
