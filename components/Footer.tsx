import { SITE } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="grid-dots">
      <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="font-display font-semibold text-xl">
            {SITE.name}
            <span className="text-coral">.</span>
          </div>
          <p className="mt-3 text-ink-muted text-sm max-w-xs">
            Affordable, mobile-first websites for businesses across Kerala
            and India — delivered in 5 days flat.
          </p>
        </div>

        <div className="space-y-2">
          <span className="block font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-2">
            Contact
          </span>
          <a
            href={`https://wa.me/${SITE.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-ink-muted hover:text-coral transition-colors"
          >
            WhatsApp — {SITE.phoneDisplay}
          </a>
          <a
            href={`tel:${SITE.phoneE164}`}
            className="block text-sm text-ink-muted hover:text-coral transition-colors"
          >
            Call — {SITE.phoneDisplay}{" "}
            <span className="text-ink-faint">(available sometimes)</span>
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="block text-sm text-ink-muted hover:text-coral transition-colors"
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
