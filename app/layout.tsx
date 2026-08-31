import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import { SITE } from "@/lib/site-config";

// Self-hosted via next/font/local (files in app/fonts, sourced from the
// @fontsource packages we previously loaded as render-blocking CSS).
// next/font preloads only the exact weights used as priority <link> tags
// in <head> (no separate CSS file the browser has to fetch and parse
// before it even discovers the font URLs) and computes ascent/descent/
// line-gap/size-adjust overrides for a fallback face sized to match.
//
// display: "optional" (rather than "swap") is what actually removes the
// layout shift: with "swap" the browser always paints the fallback first
// and then swaps to the webfont whenever it arrives, and that swap can
// still reflow text even with matched metrics (line-wrap differences,
// etc.) — every "swap" test measured non-zero CLS. "optional" gives the
// font a very short (~100ms) window to be ready; if it is, it's used from
// the very first paint (no swap, no shift); if it isn't, the page keeps
// the metric-matched fallback for that visit and never swaps mid-page —
// so there is nothing to reflow. The real font is still cached after
// first load, so it renders immediately from then on.
//
// Space Grotesk 600 and JetBrains Mono 400 are the only weights used
// above the fold (Header/Hero) — Space Grotesk 500 only appears in
// below-the-fold sections, and JetBrains Mono 500 only in the lazy,
// client-only ChatWidget badge. Splitting each family into a "critical"
// call (preloaded) and a "secondary" call (not preloaded) stops those
// two files from competing with the four fonts that are actually needed
// for first paint/LCP over the initial, most contended connections —
// they still load, just at normal (not preload) priority, exactly when
// the browser reaches their @font-face rule in the stylesheet.
const spaceGrotesk = localFont({
  src: [{ path: "./fonts/space-grotesk-600.woff2", weight: "600", style: "normal" }],
  display: "optional",
  preload: true,
  variable: "--font-display",
});

const spaceGroteskSecondary = localFont({
  src: [{ path: "./fonts/space-grotesk-500.woff2", weight: "500", style: "normal" }],
  display: "optional",
  preload: false,
  variable: "--font-display-secondary",
});

const jetbrainsMono = localFont({
  src: [{ path: "./fonts/jetbrains-mono-400.woff2", weight: "400", style: "normal" }],
  display: "optional",
  preload: true,
  variable: "--font-mono",
});

const jetbrainsMonoSecondary = localFont({
  src: [{ path: "./fonts/jetbrains-mono-500.woff2", weight: "500", style: "normal" }],
  display: "optional",
  preload: false,
  variable: "--font-mono-secondary",
});

const inter = localFont({
  src: [
    { path: "./fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-500.woff2", weight: "500", style: "normal" },
  ],
  display: "optional",
  variable: "--font-body",
});

const title =
  "Affordable Website Development in Kerala & India | Eclyze";
const description =
  "Eclyze builds fast, mobile-first, SEO-ready websites for small businesses in Kerala and across India flat fee of ₹9,999, delivered in 5 days. No hidden costs, no long agency timelines.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: title,
    template: `%s | ${SITE.name}`,
  },
  description,
  keywords: [
    "website development Kerala",
    "affordable website design India",
    "budget website development Kerala",
    "website design Kochi",
    "small business website Kerala",
    "cheap website design India",
    "5 day website delivery",
    "static website development",
    "mobile-first website design",
    "Eclyze",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.domain,
    siteName: SITE.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  verification: {
    google: "FfzVsyaS2M5ojeVmNI3qwKlkP6yqjM7mHMN9lL-_twA",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  description,
  url: SITE.domain,
  logo: `${SITE.domain}/icon-512.png`,
  telephone: SITE.phoneE164,
  email: SITE.email,
  priceRange: SITE.priceDisplay,
  areaServed: SITE.areaServed.map((area) => ({
    "@type": "AdministrativeArea",
    name: area,
  })),
  address: {
    "@type": "PostalAddress",
    addressRegion: SITE.addressRegion,
    addressCountry: SITE.addressCountry,
  },
  sameAs: [] as string[],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  alternateName: SITE.tagline,
  url: SITE.domain,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceGroteskSecondary.variable} ${jetbrainsMono.variable} ${jetbrainsMonoSecondary.variable} ${inter.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
