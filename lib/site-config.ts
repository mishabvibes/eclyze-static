export const SITE = {
  name: "Eclyze",
  legalName: "Eclyze",
  tagline: "Affordable Websites, Built to Convert",
  // Using Vercel's free subdomain for now.
  // ⚠️ After you deploy, check the exact URL Vercel assigns you
  // (Vercel dashboard → your project → Domains) and update this to match —
  // it affects the sitemap, robots.txt, canonical URL, and Open Graph tags.
  domain: "https://eclyze-website.vercel.app",
  price: "9999",
  priceDisplay: "₹9,999",
  currency: "INR",
  deliveryDays: 5,

  phoneDisplay: "+91 62386 61924",
  phoneE164: "+916238661924",
  whatsappNumber: "916238661924", // digits only, for wa.me links
  email: "info.eclyze@gmail.com",

  // TODO: swap in a live Razorpay (or other gateway) payment link for ₹9,999
  paymentLink: "https://rzp.io/rzp/yaf5oo96",

  areaServed: ["Kerala", "Kochi", "India"],
  addressRegion: "Kerala",
  addressCountry: "IN",

  // TODO: add real profile URLs here (Instagram, Facebook, LinkedIn,
  // Google Business Profile, etc.). These feed the Organization schema's
  // "sameAs" field in app/layout.tsx, which helps Google and AI answer
  // engines confirm Eclyze is a real, active business. Leave entries out
  // rather than guessing a URL — a wrong link is worse than none.
  socialProfiles: [] as string[],
};