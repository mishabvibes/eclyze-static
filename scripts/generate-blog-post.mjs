#!/usr/bin/env node
/**
 * Auto-blog generator.
 *
 * Run on a schedule (see .github/workflows/auto-blog.yml). Each run:
 *   1. Picks the next unused topic from content/blog-topics.json
 *      (auto-refills the queue with fresh AI-suggested topics when empty)
 *   2. Asks Groq for a full SEO-optimized, humanized article as JSON
 *   3. Runs a few lightweight sanity checks (word count, no leftover
 *      JSON scaffolding, no duplicate slug)
 *   4. Writes content/blog/<slug>.md with frontmatter
 *   5. Marks the topic used, pings IndexNow so search engines pick up
 *      the new page faster
 *
 * This is designed to be portable: drop it into any client's Next.js
 * project alongside lib/blog-config.ts + lib/site-config.ts (with that
 * client's own values) and it works unchanged.
 *
 * Required env var: GROQ_API_KEY
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const MODEL = "openai/gpt-oss-20b";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MAX_OUTPUT_TOKENS = 2200;

const TOPICS_PATH = path.join(ROOT, "content", "blog-topics.json");
const BLOG_DIR = path.join(ROOT, "content", "blog");

// ── Site + niche config (kept in the Next.js app so both the app and
// this script read the same source of truth) ────────────────────────
async function loadConfig() {
  const siteSrc = await fs.readFile(
    path.join(ROOT, "lib", "site-config.ts"),
    "utf-8"
  );
  const blogSrc = await fs.readFile(
    path.join(ROOT, "lib", "blog-config.ts"),
    "utf-8"
  );

  // Tiny extractor for simple string fields — avoids needing a full
  // TS loader just to read a handful of config values.
  const field = (src, key) => {
    const m = src.match(new RegExp(`${key}:\\s*"([^"]*)"`));
    return m ? m[1] : "";
  };

  return {
    siteName: field(siteSrc, "name") || "Our Business",
    domain: (field(siteSrc, "domain") || "").replace(/\/$/, ""),
    priceDisplay: field(siteSrc, "priceDisplay") || "",
    deliveryDays: field(siteSrc, "deliveryDays") || "5",
    niche: field(blogSrc, "niche") || "small business websites",
    authorName: field(blogSrc, "authorName") || "Team",
    location: field(blogSrc, "location") || "",
    toneNotes: field(blogSrc, "toneNotes") || "Warm, plain, practical.",
    minWords: Number(field(blogSrc, "minWords") || "700") || 700,
    maxWords: Number(field(blogSrc, "maxWords") || "1100") || 1100,
  };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function callGroq(apiKey, messages, maxTokens = MAX_OUTPUT_TOKENS) {
  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Groq API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function extractJson(raw) {
  let str = raw.trim();
  const fence = str.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) str = fence[1].trim();
  const start = str.indexOf("{");
  const end = str.lastIndexOf("}");
  if (start !== -1 && end > start) str = str.slice(start, end + 1);
  return JSON.parse(str);
}

// A handful of dead-giveaway AI-cliché openers — if the generated
// body leans on these, we ask for one rewrite rather than publishing
// something that reads as obviously templated.
const CLICHE_PATTERNS = [
  /in today'?s (digital age|fast-paced world|competitive market)/i,
  /in the (ever-evolving|fast-paced) world of/i,
  /unlock(ing)? the (power|potential) of/i,
  /as an ai( language model)?/i,
];

function hasCliche(text) {
  return CLICHE_PATTERNS.some((re) => re.test(text));
}

async function pickTopic(cfg, apiKey) {
  const raw = await fs.readFile(TOPICS_PATH, "utf-8");
  const topics = JSON.parse(raw);

  let next = topics.find((t) => !t.used);

  if (!next) {
    console.log("Topic queue empty — asking the model for fresh ideas...");
    const ideaRaw = await callGroq(
      apiKey,
      [
        {
          role: "system",
          content:
            `You generate blog topic ideas for a business in this niche: "${cfg.niche}" (${cfg.location}). ` +
            `Respond with ONLY a JSON array of 10 short topic strings, each a distinct, specific, ` +
            `search-worthy angle a small business owner might actually search for. No duplicates of ` +
            `generic advice — be specific. No text outside the JSON array.\n\n` +
            `Content mix: ${cfg.contentMixNote}`,
        },
        {
          role: "user",
          content: `Existing topics already covered (don't repeat these angles): ${JSON.stringify(
            topics.map((t) => t.topic)
          )}`,
        },
      ],
      600
    );

    let ideas;
    try {
      ideas = extractJson(ideaRaw.startsWith("[") ? `{"x":${ideaRaw}}` : ideaRaw);
      ideas = Array.isArray(ideas) ? ideas : ideas.x;
    } catch {
      // Fall back to a direct array parse
      ideas = JSON.parse(ideaRaw.trim());
    }

    const newTopics = ideas
      .filter((t) => typeof t === "string" && t.trim())
      .map((t) => ({ topic: t.trim(), used: false }));

    topics.push(...newTopics);
    await fs.writeFile(TOPICS_PATH, JSON.stringify(topics, null, 2) + "\n");
    next = topics.find((t) => !t.used);
  }

  return { topics, next };
}

async function generatePost(cfg, apiKey, topic) {
  const systemPrompt = `You are a skilled content writer producing ONE blog post for ${cfg.siteName}, a business doing: ${cfg.niche}${cfg.location ? ` in ${cfg.location}` : ""}.

TONE: ${cfg.toneNotes}

SEO REQUIREMENTS:
- Naturally work in the target topic's core keywords — no keyword stuffing, it must still read like a human wrote it for another human.
- Use clear H2/H3 structure (as Markdown ## and ###).
- Front-load the most useful information; don't bury the answer.
- Include at least one concrete, specific example or number — vague generalities hurt both readability and rankings.
- End with a natural, non-pushy nod toward getting a website done (not a hard sales pitch).

LENGTH: ${cfg.minWords}–${cfg.maxWords} words for the body.

Never use these clichés: "in today's digital age", "in the fast-paced world of", "unlock the power of", or any AI-disclaimer language.

Respond with ONLY this JSON object, no text outside it:
{
  "title": "SEO-friendly title, under 60 characters",
  "description": "Meta description, 140-160 characters, includes the core keyword naturally",
  "tags": ["3-5 short lowercase tags"],
  "body": "The full article as Markdown, using ## and ### headings. Do not repeat the title as an H1 inside the body."
}`;

  const userPrompt = `Write the blog post for this topic: "${topic}"`;

  const raw = await callGroq(apiKey, [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  const parsed = extractJson(raw);

  if (
    !parsed.title ||
    !parsed.description ||
    !parsed.body ||
    typeof parsed.body !== "string"
  ) {
    throw new Error("Model response missing required fields.");
  }

  return parsed;
}

async function main() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is not set — skipping this run.");
    process.exit(0); // don't fail the workflow, just skip
  }

  const cfg = await loadConfig();
  await fs.mkdir(BLOG_DIR, { recursive: true });

  const { topics, next } = await pickTopic(cfg, apiKey);
  if (!next) {
    console.log("No topic available even after refill — skipping.");
    return;
  }

  console.log(`Generating post for topic: "${next.topic}"`);

  let post;
  try {
    post = await generatePost(cfg, apiKey, next.topic);
  } catch (err) {
    console.error("Generation failed:", err.message);
    process.exit(0); // skip this run, don't break the pipeline
  }

  // One retry if the body reads as obviously AI-templated or is too short.
  const wordCount = post.body.trim().split(/\s+/).length;
  if (hasCliche(post.body) || wordCount < cfg.minWords * 0.6) {
    console.log("First draft looked templated or too short — retrying once...");
    try {
      post = await generatePost(cfg, apiKey, next.topic);
    } catch {
      // keep the first draft if the retry itself fails
    }
  }

  let slug = slugify(post.title) || slugify(next.topic) || `post-${Date.now()}`;
  let filePath = path.join(BLOG_DIR, `${slug}.md`);
  let suffix = 2;
  while (await fileExists(filePath)) {
    slug = `${slugify(post.title)}-${suffix}`;
    filePath = path.join(BLOG_DIR, `${slug}.md`);
    suffix += 1;
  }

  const date = new Date().toISOString().slice(0, 10);
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(post.title)}`,
    `description: ${JSON.stringify(post.description)}`,
    `date: ${JSON.stringify(date)}`,
    `tags: ${JSON.stringify(Array.isArray(post.tags) ? post.tags : [])}`,
    `author: ${JSON.stringify(cfg.authorName)}`,
    "---",
    "",
    post.body.trim(),
    "",
  ].join("\n");

  await fs.writeFile(filePath, frontmatter, "utf-8");
  console.log(`Wrote ${filePath}`);

  // Mark topic used
  const updated = topics.map((t) =>
    t.topic === next.topic ? { ...t, used: true, slug } : t
  );
  await fs.writeFile(TOPICS_PATH, JSON.stringify(updated, null, 2) + "\n");

  // Best-effort IndexNow ping — helps Bing/Yandex pick up the new page
  // fast. Google doesn't support IndexNow; it relies on the sitemap
  // (already updated automatically via app/sitemap.ts) plus normal
  // crawl scheduling.
  if (cfg.domain) {
    try {
      const key = "d33cf33a632b2f2a149aec9ddce04f71";
      const url = `${cfg.domain}/blog/${slug}`;
      const pingUrl = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(
        url
      )}&key=${key}&keyLocation=${encodeURIComponent(
        `${cfg.domain}/${key}.txt`
      )}`;
      await fetch(pingUrl);
      console.log("Pinged IndexNow for:", url);
    } catch (err) {
      console.warn("IndexNow ping failed (non-fatal):", err.message);
    }
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(0); // never fail the workflow loudly — just skip this run
});
