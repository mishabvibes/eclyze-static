import Link from "next/link";
import { SITE } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="grid-dots">
      <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col md:flex-row md:items-start justify-between gap-10">
        <div>
          <div className="font-display font-semibold text-xl">
            {SITE.name}
            <span className="text-navy">.</span>
          </div>
          <p className="mt-3 text-ink-muted text-sm max-w-xs">
            Affordable, mobile-first websites for businesses across Kerala
            and India delivered in 5 days flat.
          </p>
        </div>

        <div className="space-y-2">
          <span className="block font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-2">
            Explore
          </span>
          <Link
            href="/website-cost-kerala"
            className="block text-sm text-ink-muted hover:text-navy transition-colors"
          >
            Website Cost in Kerala
          </Link>
          <Link
            href="/small-business-website"
            className="block text-sm text-ink-muted hover:text-navy transition-colors"
          >
            Websites for Small Business
          </Link>
          <Link
            href="/website-design-kochi"
            className="block text-sm text-ink-muted hover:text-navy transition-colors"
          >
            Website Design in Kochi
          </Link>
          <Link
            href="/ai-chatbot-website"
            className="block text-sm text-ink-muted hover:text-navy transition-colors"
          >
            AI Chatbot Websites
          </Link>
          <Link
            href="/blog"
            className="block text-sm text-ink-muted hover:text-navy transition-colors"
          >
            Blog
          </Link>
        </div>

        <div className="space-y-2">
          <span className="block font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-2">
            Contact
          </span>
          <a
            href={`https://wa.me/${SITE.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block text-sm text-ink-muted hover:text-navy transition-colors"
          >
            WhatsApp — {SITE.phoneDisplay}{" "}
            <span className="text-ink-faint text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 inline-block">
              (100% chance I read it)
            </span>
          </a>
          <a
            href={`tel:${SITE.phoneE164}`}
            className="group block text-sm text-ink-muted hover:text-navy transition-colors"
          >
            Call — {SITE.phoneDisplay}{" "}
            <span className="text-ink-faint text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 inline-block">
              (90% chance I don&apos;t pick up)
            </span>
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="block text-sm text-ink-muted hover:text-navy transition-colors"
          >
            {SITE.email}
          </a>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="font-mono text-[11px] text-ink-faint">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </span>
          <span className="font-mono text-[11px] text-ink-faint">
            Website development for Kerala &amp; India
          </span>
        </div>
      </div>
    </footer>
  );
}