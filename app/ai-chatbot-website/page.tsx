import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntakeForm from "@/components/IntakeForm";
import AIConcierge from "@/components/AIConcierge";
import ChatWidget from "@/components/ChatWidgetLoader";
import { SITE } from "@/lib/site-config";

// NOTE: `title` is the bare page title — the root layout's metadata.title.template
// ("%s | Eclyze") appends the brand suffix automatically for the <title> tag.
// Don't add "| Eclyze" here, or it renders twice ("... | Eclyze | Eclyze").
const title = "Website with a Built-in AI Chat Assistant";
const fullTitle = `${title} | ${SITE.name}`;
const description =
  "Get a website with a built-in AI sales concierge that answers visitors 24/7 and points serious buyers to WhatsApp. Available on Eclyze websites for Kerala & India businesses.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "AI chatbot for website India",
    "website with AI chat assistant",
    "AI sales assistant website",
    "24/7 AI chatbot small business",
    "AI chat widget website Kerala",
  ],
  alternates: { canonical: "/ai-chatbot-website" },
  openGraph: { title: fullTitle, description, url: `${SITE.domain}/ai-chatbot-website`, type: "website" },
  twitter: { title: fullTitle, description },
};

const faqs = [
  {
    q: "Is the AI chat assistant included in the ₹9,999 package?",
    a: "It's available as part of an Eclyze website build — ask us when you get in touch and we'll confirm what fits your package.",
  },
  {
    q: "Do I need to manage or train it myself?",
    a: "No. It's set up during your build using your business details, so it can answer visitor questions from day one — no dashboard, no ongoing setup.",
  },
  {
    q: "What happens if a visitor asks something it can't answer?",
    a: "It points them straight to WhatsApp or a call, so you never lose an enquiry just because the assistant didn't know the answer.",
  },
];

export default function AIChatbotWebsite() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="border-b border-line grid-dots">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              AI-Powered Websites
            </span>
            <h1 className="mt-4 font-display font-semibold text-3xl md:text-5xl max-w-2xl leading-tight">
              A website with an AI chat assistant built in.
            </h1>
            <p className="mt-4 text-ink-muted max-w-xl leading-relaxed">
              Most small-business websites in Kerala and India are
              static a visitor either calls, or leaves. Eclyze sites
              can ship with an AI sales concierge that talks to every
              visitor instead.
            </p>
          </div>
        </section>

        <AIConcierge />

        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              Common Questions
            </span>
            <div className="mt-10 space-y-8 max-w-2xl">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-display-alt font-medium text-base text-ink">
                    {f.q}
                  </h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>

            <a
              href="#intake"
              className="mt-12 inline-block font-mono text-sm uppercase tracking-widest bg-coral text-coral-ink px-6 py-3.5 border border-coral hover:bg-bg-invert hover:text-invert-ink hover:border-bg-invert transition-colors"
            >
              Get a Website with AI Chat — {SITE.priceDisplay}
            </a>
          </div>
        </section>

        <IntakeForm />
      </main>
      <Footer />
      <ChatWidget />

      {/* FAQPage structured data for this page's questions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
