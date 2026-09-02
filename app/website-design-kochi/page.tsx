import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntakeForm from "@/components/IntakeForm";
import ChatWidget from "@/components/ChatWidgetLoader";
import { SITE } from "@/lib/site-config";

const title = "Website Design in Kochi & Across Kerala | Eclyze";
const description =
  "Professional, mobile-first website design for businesses in Kochi and across Kerala flat ₹9,999, live in 5 days. No office visits needed, the entire process runs over WhatsApp and call.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "website design Kochi",
    "website design Kerala",
    "web designer near me Kerala",
    "website development Kochi",
    "website design Kozhikode",
    "website design Thrissur",
    "website design Trivandrum",
    "website design Kottayam",
  ],
  alternates: { canonical: "/website-design-kochi" },
  openGraph: { title, description, url: `${SITE.domain}/website-design-kochi`, type: "website" },
};

const cities = [
  "Kochi / Ernakulam",
  "Kozhikode",
  "Thrissur",
  "Thiruvananthapuram",
  "Kottayam",
  "Kannur",
  "Kollam",
  "Malappuram",
];

export default function WebsiteDesignKochi() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="border-b border-line grid-dots">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              Website Design in Kerala
            </span>
            <h1 className="mt-4 font-display font-semibold text-3xl md:text-5xl max-w-2xl leading-tight">
              Website design in Kochi and everywhere else in Kerala.
            </h1>
            <p className="mt-4 text-ink-muted max-w-xl leading-relaxed">
              Eclyze is based in Kerala and builds websites for
              businesses across the state and beyond. No office visit
              required the entire process, from brief to launch,
              happens over WhatsApp and a call.
            </p>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              Areas We Serve
            </span>
            <h2 className="mt-4 font-display font-semibold text-2xl sm:text-3xl max-w-xl leading-tight">
              Wherever your business is in Kerala, this works the same
              way.
            </h2>

            <div className="mt-10 flex flex-wrap gap-3">
              {cities.map((c) => (
                <span
                  key={c}
                  className="font-mono text-xs uppercase tracking-widest text-ink border border-line-strong px-4 py-2.5"
                >
                  {c}
                </span>
              ))}
            </div>

            <p className="mt-8 max-w-xl text-sm text-ink-muted leading-relaxed">
              Every site is mobile-first and built with on-page local
              SEO in mind clean metadata, semantic structure, and a
              layout tuned for how customers in Kerala actually search
              and browse on their phones.
            </p>
          </div>
        </section>

        <section className="border-b border-line bg-bg-panel/40">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              How It Works
            </span>
            <h2 className="mt-4 font-display font-semibold text-2xl sm:text-3xl max-w-xl leading-tight">
              Fully remote. No commute, no office visits.
            </h2>
            <p className="mt-4 max-w-xl text-ink-muted leading-relaxed text-[15px]">
              Share your business details over WhatsApp, review the
              build online, and launch — all within 5 working days.
              Whether you&apos;re in Kochi, Kozhikode, or a small town
              in between, the process is identical.
            </p>

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
