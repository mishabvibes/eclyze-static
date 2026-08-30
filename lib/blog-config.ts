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

  // Target length for each post.
  minWords: 700,
  maxWords: 1100,

  // How many new posts to generate per automation run.
  postsPerRun: 1,
} as const;
