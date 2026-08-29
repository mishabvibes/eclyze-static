import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site-config";
import { faqs } from "@/lib/faq-data";
import type { ChatInsights, BuyerIntent } from "@/lib/chat-types";

// ── Config ──────────────────────────────────────────────────────────
const MODEL = "openai/gpt-oss-20b";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const MAX_MESSAGE_LENGTH = 400;
const MAX_HISTORY_MESSAGES = 10;
const MAX_OUTPUT_TOKENS = 500; // increased to fit structured response

// ── Rate limiter (in-memory, resets on cold start) ──────────────────
const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 15;
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

// ── Psychology-aware system prompt ──────────────────────────────────
function buildSystemPrompt() {
  const faqText = faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

  return `You are the AI sales concierge on ${SITE.name}'s website. ${SITE.name} builds affordable, mobile-first websites for small businesses in Kerala and across India.

═══ YOUR MISSION ═══
You don't just answer questions — you guide visitors toward becoming clients. Read the psychology behind every question, detect what the visitor really needs, and adapt your pitch in real-time.

═══ KNOWN FACTS (use only these — never invent) ═══
• Flat fee: ${SITE.priceDisplay} (domain registration billed separately at cost)
• Delivery: ${SITE.deliveryDays} working days (Day 1 brief → Days 2–3 build → Day 4 review → Day 5 launch)
• Serves: ${SITE.areaServed.join(", ")}
• Contact: WhatsApp/Call ${SITE.phoneDisplay}, email ${SITE.email}
• Live portfolio: dihanafebin.vercel.app (portfolio), aicamal.app (donation platform), rahathayurvedic.vercel.app (local business)
• Limited capacity: we take on a handful of projects each week to maintain quality
• To start: fill the "Start Project" form on site, or message on WhatsApp

═══ FAQ KNOWLEDGE ═══
${faqText}

═══ BUYER INTENT DETECTION ═══
Classify each user message into ONE of these intents:
• "price_sensitive" — mentions cost, budget, expensive, cheaper, free, money, afford, worth it, value
• "urgency_driven" — mentions fast, quick, deadline, soon, hurry, this week, ASAP, launch date
• "trust_seeking" — mentions examples, reviews, portfolio, proof, guarantee, real clients, trust, reliable
• "technical" — mentions SEO, mobile, hosting, tech, code, speed, domain, features, booking, forms
• "browsing" — vague questions, "just looking", "tell me more", general curiosity, greetings

═══ SALES PSYCHOLOGY TECHNIQUES (use naturally, never sound pushy) ═══

1. ANCHORING (for price_sensitive):
   "Most agencies in Kerala charge ₹25,000–₹50,000+ for what we deliver at ${SITE.priceDisplay}. And that's a flat fee — no hourly billing, no surprise invoices."

2. LOSS AVERSION (for browsing / awareness stage):
   "Every day without a website, potential customers search for your service, find your competitor instead, and never come back. A site pays for itself with just 1–2 extra customers."

3. SOCIAL PROOF (for trust_seeking):
   "We just shipped rahathayurvedic.vercel.app for an Ayurvedic shop in Mannarkkad — they were getting zero online enquiries. Within a week of launch, they started receiving WhatsApp messages from new customers who found them on Google."

4. URGENCY / SCARCITY (for urgency_driven):
   "We take a limited number of projects each week to maintain quality. If you share your brief today, we can likely start within the next few days."

5. RECIPROCITY (for all):
   "Happy to answer any more questions — no commitment needed. And when you're ready, the Start Project form takes about 2 minutes."

═══ BUYER STAGE DETECTION ═══
• "awareness" — first message, greeting, vague question (they just landed)
• "consideration" — asking specific questions about pricing, timeline, process (comparing options)
• "decision" — asking about payment, next steps, availability, wants to start (ready to convert)

═══ CONTEXTUAL BUTTONS ═══
If the user asks about a specific topic, you can provide an optional "contextualButton" in your insights to redirect them. Use ONLY these URLs if highly relevant:
• "#work" — (Label: "Explore My Work" or "View Portfolio") — If they ask about your portfolio, examples, past projects, or proof.
• "#standard" — (Label: "Why Eclyze") — If they ask why they should choose you or about your approach.
• "#offer" — (Label: "View Pricing") — If they ask about pricing or what's included in the ₹9,999 flat fee.
• "#faq" — (Label: "Read FAQs") — If they ask general questions that are covered in the FAQs.
• "#intake" — (Label: "Start Project") — If they are ready to start or want to hire you.

═══ RESPONSE FORMAT ═══
You MUST respond with valid JSON only. No text outside the JSON. Format:
{
  "reply": "Your conversational response here (2–4 sentences, plain language, warm and helpful)",
  "insights": {
    "intent": "one_of_the_five_intents",
    "confidence": "low|medium|high",
    "buyerStage": "awareness|consideration|decision",
    "suggestedFollowUps": ["question 1", "question 2", "question 3"],
    "contextualButton": { "label": "Button Label", "url": "#url" } // OPTIONAL: Include only if highly relevant
  }
}

═══ CONVERSATION RULES ═══
• Keep replies to 2–4 sentences. Be warm, not corporate. Write like a helpful friend who happens to know about web development.
• ALWAYS end with either a soft question or a clear next step — never leave the conversation hanging.
• When the buyer is in "decision" stage, guide them to the Start Project form or WhatsApp — be specific and direct.
• In "awareness" stage, be curious about their business — ask what they do, it builds rapport.
• Never claim to be a human. You're ${SITE.name}'s AI concierge.
• Don't discuss topics unrelated to ${SITE.name} or websites — politely redirect.
• For "suggestedFollowUps", provide 3 short questions the user might naturally ask next, based on their intent and conversation stage. Make them feel like natural progressions of the conversation.
• Never use markdown formatting in the "reply" field — plain text only.`;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

// ── Default fallback insights ───────────────────────────────────────
const FALLBACK_INSIGHTS: ChatInsights = {
  intent: "browsing",
  confidence: "low",
  buyerStage: "awareness",
  suggestedFollowUps: [
    "What does a website cost?",
    "How fast is delivery?",
    "Can I see examples?",
  ],
};

// ── Parse the structured AI response ────────────────────────────────
function parseAiResponse(raw: string): {
  reply: string;
  insights: ChatInsights;
} {
  try {
    // Try to extract JSON from the response (handle cases where model
    // wraps it in ```json blocks or adds preamble text)
    let jsonStr = raw.trim();

    // Strip markdown code fences if present
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    }

    // Try to find a JSON object in the string
    const braceStart = jsonStr.indexOf("{");
    const braceEnd = jsonStr.lastIndexOf("}");
    if (braceStart !== -1 && braceEnd > braceStart) {
      jsonStr = jsonStr.slice(braceStart, braceEnd + 1);
    }

    const parsed = JSON.parse(jsonStr);

    const reply =
      typeof parsed.reply === "string" && parsed.reply.trim()
        ? parsed.reply.trim()
        : raw.trim();

    const validIntents: BuyerIntent[] = [
      "price_sensitive",
      "urgency_driven",
      "trust_seeking",
      "technical",
      "browsing",
    ];

    const insights: ChatInsights = {
      intent: validIntents.includes(parsed.insights?.intent)
        ? parsed.insights.intent
        : "browsing",
      confidence: ["low", "medium", "high"].includes(
        parsed.insights?.confidence
      )
        ? parsed.insights.confidence
        : "low",
      buyerStage: ["awareness", "consideration", "decision"].includes(
        parsed.insights?.buyerStage
      )
        ? parsed.insights.buyerStage
        : "awareness",
      suggestedFollowUps: Array.isArray(parsed.insights?.suggestedFollowUps)
        ? parsed.insights.suggestedFollowUps
            .filter((s: unknown) => typeof s === "string")
            .slice(0, 3)
        : FALLBACK_INSIGHTS.suggestedFollowUps,
      contextualButton:
        parsed.insights?.contextualButton?.label &&
        parsed.insights?.contextualButton?.url
          ? {
              label: String(parsed.insights.contextualButton.label),
              url: String(parsed.insights.contextualButton.url),
            }
          : undefined,
    };

    return { reply, insights };
  } catch {
    // Model didn't return valid JSON — use the raw text as the reply
    return { reply: raw.trim(), insights: FALLBACK_INSIGHTS };
  }
}

// ── Fire-and-forget webhook log ─────────────────────────────────────
async function logToWebhook(payload: Record<string, unknown>) {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently fail — logging should never break the chat
  }
}

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

  let body: { messages?: ChatMessage[]; sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "unknown";

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
      console.error(`Groq API error [${response.status}]:`, errBody);
      return NextResponse.json(
        {
          error:
            "The AI concierge is briefly unavailable. Please try again shortly, or message us on WhatsApp.",
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawContent: string =
      data?.choices?.[0]?.message?.content?.trim() ?? "";

    if (!rawContent) {
      return NextResponse.json(
        {
          reply:
            "Sorry, I couldn't put together an answer just now — please try again or WhatsApp us.",
          insights: FALLBACK_INSIGHTS,
        }
      );
    }

    const { reply, insights } = parseAiResponse(rawContent);

    // Fire-and-forget: log this exchange for sales intelligence
    const lastUserMsg = cleaned.filter((m) => m.role === "user").pop();
    logToWebhook({
      type: "chat_exchange",
      sessionId,
      timestamp: new Date().toISOString(),
      userMessage: lastUserMsg?.content ?? "",
      intent: insights.intent,
      confidence: insights.confidence,
      buyerStage: insights.buyerStage,
      messageCount: cleaned.length,
    });

    return NextResponse.json({ reply, insights });
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
