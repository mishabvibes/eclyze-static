import Image from "next/image";
import { SITE } from "@/lib/site-config";

// TODO: replace with your real name and a short personal bio line.
const FOUNDER_NAME = "Muhammed Mishab.";
const FOUNDER_ROLE = "Founder, Eclyze";
const FOUNDER_IMAGE = "/founder.webp";

export default function About() {
    return (
        <section id="about" className="border-b border-line">
            <div className="mx-auto max-w-6xl px-6 py-24">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
                    Who's Behind This
                </span>
                <h2 className="mt-4 font-display font-semibold text-3xl md:text-4xl max-w-2xl leading-tight">
                    A dedicated developer, not a call center.
                </h2>

                <div className="mt-10 flex flex-col md:flex-row gap-8 md:items-start">
                    <div className="shrink-0">
                        <Image
                            src={FOUNDER_IMAGE}
                            alt={FOUNDER_NAME}
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full object-cover border border-line-strong"
                        />
                    </div>

                    <div className="max-w-2xl">
                        <p className="font-display-alt font-medium text-lg text-ink">
                            {FOUNDER_NAME}
                        </p>
                        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mt-1">
                            {FOUNDER_ROLE}
                        </p>
                        <p className="mt-4 text-ink-muted leading-relaxed">
                            I started {SITE.name} because too many small businesses in
                            Kerala were stuck choosing between a slow, expensive agency
                            and a DIY builder that never quite got finished. I build
                            every website myself no account managers, no outsourced
                            teams so you talk directly to the person doing the work,
                            from brief to launch, over WhatsApp and calls.
                        </p>
                    </div>
                </div>
            </div>

            {/* Person schema for E-E-A-T / author trust signals */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        name: FOUNDER_NAME,
                        jobTitle: FOUNDER_ROLE,
                        worksFor: {
                            "@type": "Organization",
                            name: SITE.name,
                        },
                        email: SITE.email,
                    }),
                }}
            />
        </section>
    );
}