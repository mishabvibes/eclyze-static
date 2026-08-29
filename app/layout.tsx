import type { Metadata } from "next";

import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import "./globals.css";
import { SITE } from "@/lib/site-config";

const title =
  "Affordable Website Development in Kerala & India | Eclyze";
const description =
  "Eclyze builds fast, mobile-first, SEO-ready websites for small businesses in Kerala and across India — flat fee of ₹9,999, delivered in 5 days. No hidden costs, no long agency timelines.";

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
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  description,
  url: SITE.domain,
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
