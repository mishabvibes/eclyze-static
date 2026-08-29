# Eclyze — Website

A Next.js (App Router + Tailwind CSS v4) marketing site for **Eclyze**, a
Kerala-based website studio offering flat-fee (₹9,999), 5-day website
builds for small businesses across India.

## Design

Warm, premium palette — ivory background, deep navy + coral accents, with
an inverted near-black "spec sheet" card as the signature contrast moment.
Type: Space Grotesk (headings), Inter (body), JetBrains Mono
(labels/data) — all self-hosted via `@fontsource`.

## SEO

- Full metadata (title template, description, keywords, canonical,
  Open Graph, Twitter card) targeting "affordable/budget website
  development Kerala/India" search intent — see `app/layout.tsx`.
- `ProfessionalService` structured data (schema.org) with phone, email,
  price range, and area served, injected in `app/layout.tsx`.
- `FAQPage` structured data generated from the on-page FAQ content in
  `components/FAQ.tsx` — written to target common local search queries
  ("how much does a website cost in Kerala", etc.) and to qualify for
  Google's FAQ rich results.
- `app/robots.ts` and `app/sitemap.ts` — auto-generate `/robots.txt` and
  `/sitemap.xml`.
- Semantic heading hierarchy (one `h1` in the hero, `h2` per section,
  `h3` per card/question), fast static rendering, and self-hosted fonts
  for good Core Web Vitals.

**Before launch:**
1. Set your real production domain in `lib/site-config.ts` (`SITE.domain`)
   — this feeds the canonical URL, sitemap, robots.txt, and Open Graph
   tags.
2. Verify the site in [Google Search Console](https://search.google.com/search-console)
   and submit the sitemap at `/sitemap.xml`.
3. Consider adding a Google Business Profile for Eclyze (Kerala) — this
   matters more for local map-pack rankings than on-page SEO alone.

## Brand / contact config

Everything — company name, price, phone, WhatsApp number, email — lives
in **one file**: `lib/site-config.ts`. Change it there and it updates
everywhere (header, footer, forms, metadata, structured data).

```ts
export const SITE = {
  name: "Eclyze",
  price: "9999",
  priceDisplay: "₹9,999",
  phoneDisplay: "+91 62386 61924",
  whatsappNumber: "916238661924",
  email: "info.eclyze@gmail.com",
  paymentLink: "...", // ⚠️ update to a live payment link for ₹9,999
  ...
};
```

⚠️ **`paymentLink` still points to the placeholder Razorpay link from the
previous ₹1,599 pricing.** Generate a new payment link for ₹9,999 and
replace it here before going live.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Build for production

```bash
npm run build
npm run start
```

(Scripts use `--webpack` since Turbopack's native binary can be blocked by
Windows Application Control / antivirus policies on some machines.)

## Structure

- `lib/site-config.ts` — single source of truth for brand/contact/pricing
- `app/layout.tsx` — fonts, SEO metadata, Organization schema
- `app/robots.ts`, `app/sitemap.ts` — SEO infrastructure
- `app/globals.css` — design tokens (colors, grid, corner brackets)
- `components/Header.tsx` — sticky nav
- `components/Hero.tsx` — headline, trust strip, build-status timeline
- `components/Standard.tsx` — 3-feature "why Eclyze" grid
- `components/Work.tsx` — sample project showcase (placeholder content —
  swap in real client work)
- `components/WhyUs.tsx` — Eclyze vs agency vs DIY comparison table
- `components/Offer.tsx` — pricing card + day-by-day timeline
- `components/FAQ.tsx` — local-search-focused FAQ + FAQPage schema
- `components/IntakeForm.tsx` — project intake form → opens WhatsApp with
  a pre-filled brief, then shows a "Pay Now" confirmation panel
- `components/Footer.tsx` — contact + copyright
