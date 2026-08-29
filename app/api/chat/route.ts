import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site-config";
import { faqs } from "@/lib/faq-data";

// --- Config -----------------------------------------------------------
// Free-tier model on Groq (no credit card, generous daily limits).
// Confirmed current/active on Groq's docs as of this writing — if you
// see deprecation notices in your Groq console, swap this string only.
const MODEL = "openai/gpt-oss-20b";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const MAX_MESSAGE_LENGTH = 400; // characters, per user message
const MAX_HISTORY_MESSAGES = 8; // turns kept, keeps token usage predictable
const MAX_OUTPUT_TOKENS = 220; // caps cost + keeps replies chat-widget sized

// --- Very-cheap in-memory rate limiter ---------------------------------
// Resets whenever the serverless instance cold-starts, so it is not a
// hard guarantee — but it stops a single visitor (or a bot) from
// hammering the free quota within one warm instance. Good enough for a
// single-site demo; do not rely on this alone if this is ever exposed
// to many client sites at once.
const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter(
    (t) => now - t < WINDOW_MS
  );
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}

// --- System prompt: strictly scoped to Eclyze's own facts --------------
function buildSystemPrompt() {
  const faqText = faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

  return `You are the AI concierge on ${SITE.name}'s own website. ${SITE.name} builds affordable, mobile-first websites for small businesses in Kerala and across India.

Known facts (only use these — never invent pricing, timelines, or policies beyond what's given here):
- Flat fee: ${SITE.priceDisplay} (domain registration billed separately, at cost)
- Delivery: ${SITE.deliveryDays} working days (Day 1 brief, Days 2–3 build, Day 4 review, Day 5 launch)
- Serves: ${SITE.areaServed.join(", ")}
- Contact: WhatsApp/Call ${SITE.phoneDisplay}, email ${SITE.email}
- To start a project: fill the "Start Project" form on this site, or message on WhatsApp

Frequently asked questions and their answers:
${faqText}

Rules:
- Answer only questions about ${SITE.name}'s services, pricing, process, or how to get started.
- Keep answers short — 2–4 sentences, plain language, no markdown headers.
- If asked something you don't have facts for (custom features, specific timelines beyond the above, refunds, legal terms, or anything unrelated to ${SITE.name}), say you're not certain and point them to WhatsApp (${SITE.phoneDisplay}) or the "Start Project" form instead of guessing.
- Never claim to be a human. If asked, say you're ${SITE.name}'s AI concierge.
- Do not discuss topics unrelated to ${SITE.name} or website development — politely redirect back.`;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Chat isn't configured yet — GROQ_API_KEY is missing on the server.",
      },
      { status: 500 }
    );
  }

  // Best-effort client identifier for rate limiting.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "You've sent a lot of messages in a short time — please wait a few minutes, or reach us directly on WhatsApp.",
      },
      { status: 429 }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];

  // Validate + trim history to bound token usage.
  const cleaned = incoming
    .filter(
      (m): m is ChatMessage =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (cleaned.length === 0) {
    return NextResponse.json(
      { error: "Send a message first." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...cleaned,
        ],
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(
        `Groq API error [${response.status}]:`,
        errBody
      );
      return NextResponse.json(
        {
          error:
            "The AI concierge is briefly unavailable. Please try again shortly, or message us on WhatsApp.",
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply: string =
      data?.choices?.[0]?.message?.content?.trim() ??
      "Sorry, I couldn't put together an answer just now — please try again or WhatsApp us.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      {
        error:
          "Something went wrong reaching the AI service. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
