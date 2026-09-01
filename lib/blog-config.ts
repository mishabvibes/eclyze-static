// ── Auto-blog configuration ─────────────────────────────────────────
// Everything the AI content pipeline needs to know about THIS business
// lives here. To reuse this whole feature on a client's site, copy
// scripts/generate-blog-post.mjs, content/blog-topics.json, the
// app/blog/* pages, and this file — then just edit the values below
// (and lib/site-config.ts) to match the client's business. No other
// code needs to change.
export const BLOG_CONFIG = {
  // What this business does, in plain words — steers topic angle and
  // examples the AI reaches for.
  niche: "affordable, fast-turnaround website design for small businesses and local shops",

  // Who's "writing" the posts (shown as the byline).
  authorName: "Eclyze Team",

  // Where the business operates — used for local-SEO angle in posts.
  location: "Kerala, India",

  // Style notes fed straight into the writing prompt.
  toneNotes:
    "Warm, plainspoken, practical. Short paragraphs. Contractions are fine. " +
    "Avoid corporate jargon, avoid generic AI-sounding openers like " +
    "\"In today's digital age\" or \"In the fast-paced world of...\". " +
    "Write like a knowledgeable person explaining something to a friend " +
    "who runs a small business, not like a marketing brochure.",

  // Content mix guidance for the AI topic-idea generator (used when the
  // topic queue in content/blog-topics.json runs dry and the model has
  // to invent fresh ideas). Keeps the blog anchored on core buyer
  // search intent, with the AI concierge feature as a minority,
  // recurring differentiator angle — not the blog's main subject.
  contentMixNote:
    "About 7 in 10 ideas should be core small-business-website topics " +
    "(cost, timeline, SEO, mistakes to avoid, mobile-first, domains, " +
    "maintenance — things a Kerala shop owner would actually search for). " +
    "About 2 in 10 ideas can spotlight the built-in AI sales concierge " +
    "feature as a differentiator (what it does, why it helps convert " +
    "visitors, behind-the-scenes) — but never let AI become the blog's " +
    "main subject. About 1 in 10 can be brand/trust/founder-story angles. " +
    "Do not cluster the AI-angle ideas together — spread them out.",

  // Target length for each post.
  minWords: 700,
  maxWords: 1100,

  // How many new posts to generate per automation run.
  postsPerRun: 1,
} as const;
