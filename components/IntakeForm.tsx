"use client";

import { useState } from "react";
import { SITE } from "@/lib/site-config";

const requirementOptions = [
  "Hero",
  "About",
  "Services",
  "Contact",
  "WhatsApp",
  "Gallery",
];

export default function IntakeForm() {
  const [submitted, setSubmitted] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([]);

  function toggleRequirement(name: string) {
    setRequirements((prev) =>
      prev.includes(name)
        ? prev.filter((r) => r !== name)
        : [...prev, name]
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const lines = [
      `New ${SITE.name} project brief:`,
      `Full Name: ${form.get("fullName") || "-"}`,
      `Business Name: ${form.get("businessName") || "-"}`,
      `Phone: ${form.get("phone") || "-"}`,
      `Email: ${form.get("email") || "-"}`,
      `Assets Link: ${form.get("assets") || "-"}`,
      `Requirements: ${requirements.length ? requirements.join(", ") : "-"}`,
      `Domain Strategy: ${form.get("domain") || "-"}`,
      `Creative Brief: ${form.get("brief") || "-"}`,
    ];

    const text = encodeURIComponent(lines.join("\n"));
    window.open(
      `https://wa.me/${SITE.whatsappNumber}?text=${text}`,
      "_blank"
    );
    setSubmitted(true);
  }

  return (
    <section id="intake" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
          Start Your Project
        </span>
        <h2 className="mt-4 font-display font-semibold text-3xl md:text-4xl max-w-2xl leading-tight">
          Tell us what you&apos;re building.
        </h2>
        <p className="mt-4 max-w-xl text-ink-muted leading-relaxed">
          Five minutes of your time gets the build started. The more
          specific you are, the closer day one gets to your finished site.
          Prefer to just talk it through? WhatsApp us — that&apos;s the
          fastest way to reach the team.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="mt-14 border border-line bg-bg-panel/40 p-6 md:p-10 space-y-12"
          >
            {/* Basic Info */}
            <fieldset>
              <legend className="font-mono text-[11px] uppercase tracking-widest text-navy mb-5">
                Basic Info
              </legend>
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Full Name" name="fullName" required />
                <Field label="Business Name" name="businessName" required />
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  required
                />
                <Field label="Email" name="email" type="email" required />
              </div>
            </fieldset>

            {/* Project Assets */}
            <fieldset>
              <legend className="font-mono text-[11px] uppercase tracking-widest text-navy mb-5">
                Project Assets
              </legend>
              <Field
                label="Drive / Dropbox / WeTransfer Link"
                name="assets"
              />
              <p className="mt-2 font-mono text-[11px] text-ink-faint">
                No assets yet? Leave this blank — we&apos;ll follow up.
              </p>
            </fieldset>

            {/* Functional Requirements */}
            <fieldset>
              <legend className="font-mono text-[11px] uppercase tracking-widest text-navy mb-5">
                Functional Requirements
              </legend>
              <div className="flex flex-wrap gap-3">
                {requirementOptions.map((opt) => {
                  const active = requirements.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleRequirement(opt)}
                      className={`font-mono text-xs uppercase tracking-wider px-4 py-2 border transition-colors ${
                        active
                          ? "bg-navy text-invert-ink border-navy"
                          : "border-line-strong text-ink-muted hover:border-navy hover:text-navy"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Domain Strategy */}
            <fieldset>
              <legend className="font-mono text-[11px] uppercase tracking-widest text-navy mb-5">
                Domain Strategy
              </legend>
              <select
                name="domain"
                defaultValue=""
                required
                className="w-full bg-bg border border-line-strong px-4 py-3 text-sm text-ink focus:outline-none focus:border-navy"
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="Custom Domain (Paid, billed separately)">
                  Custom Domain (Paid, billed separately)
                </option>
                <option value="Free Eclyze Subdomain">
                  Free Subdomain
                </option>
              </select>
            </fieldset>

            {/* Creative Brief */}
            <fieldset>
              <legend className="font-mono text-[11px] uppercase tracking-widest text-navy mb-5">
                Creative Brief
              </legend>
              <textarea
                name="brief"
                rows={4}
                placeholder="What does your business do, and what should this site achieve?"
                className="w-full bg-bg border border-line-strong px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-navy resize-none"
              />
            </fieldset>

            <div>
              <button
                type="submit"
                className="font-mono text-sm uppercase tracking-widest bg-coral text-coral-ink px-6 py-3.5 border border-coral hover:bg-bg-invert hover:text-invert-ink hover:border-bg-invert transition-colors"
              >
                Submit Project Brief →
              </button>
              <p className="mt-3 font-mono text-[11px] text-ink-faint">
                We&apos;ll open WhatsApp with your brief pre-filled — hit
                send there to confirm. WhatsApp is the fastest way to reach
                us; you can also call {SITE.phoneDisplay}.
              </p>
            </div>
          </form>
        ) : (
          <div className="mt-14 corner-brackets border border-line-strong bg-bg-panel p-10 max-w-xl">
            <h3 className="font-display font-semibold text-2xl">
              Thanks for choosing us!
            </h3>
            <p className="mt-3 text-ink-muted leading-relaxed">
              Your project brief was sent on WhatsApp. Complete your
              pre-order with the payment link below to lock in your build
              slot.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={SITE.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm uppercase tracking-widest bg-coral text-coral-ink px-6 py-3.5 border border-coral hover:bg-bg-invert hover:text-invert-ink hover:border-bg-invert transition-colors"
              >
                Pay Now — {SITE.priceDisplay}
              </a>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="font-mono text-sm uppercase tracking-widest px-6 py-3.5 border border-line-strong text-ink hover:border-navy hover:text-navy transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[11px] text-ink-faint mb-2">
        {label}
        {required && <span className="text-navy"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full bg-bg border border-line-strong px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-navy"
      />
    </label>
  );
}
