// ── Buyer intent types ────────────────────────────────────────────────
export type BuyerIntent =
  | "price_sensitive"
  | "urgency_driven"
  | "trust_seeking"
  | "technical"
  | "browsing";

export type BuyerStage =
  | "awareness"    // just landed, exploring
  | "consideration" // comparing options, asking specifics
  | "decision";     // ready to act, needs a nudge

// ── Chat message types ───────────────────────────────────────────────
export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  contextualButton?: { label: string; url: string };
}

// ── AI response metadata (hidden from the visitor) ───────────────────
export interface ChatInsights {
  intent: BuyerIntent;
  confidence: "low" | "medium" | "high";
  buyerStage: BuyerStage;
  suggestedFollowUps: string[];
  contextualButton?: { label: string; url: string };
}

// ── Full API response shape ──────────────────────────────────────────
export interface ChatApiResponse {
  reply: string;
  insights: ChatInsights;
}

// ── Conversation log sent to the webhook ─────────────────────────────
export interface ConversationLog {
  sessionId: string;
  timestamp: string;
  messages: ChatMessage[];
  insights: ChatInsights[];         // one per assistant turn
  durationMs: number;               // how long the widget was open
  convertedTo: "whatsapp" | "form" | null;
}

// ── Dynamic suggestion sets keyed by detected intent ─────────────────
export const INTENT_SUGGESTIONS: Record<BuyerIntent, string[]> = {
  price_sensitive: [
    "What's included in ₹9,999?",
    "Any hidden costs?",
    "Can I pay in installments?",
  ],
  urgency_driven: [
    "Can you start this week?",
    "What if I need changes after launch?",
    "How does the 5-day timeline work?",
  ],
  trust_seeking: [
    "Can I see live examples?",
    "Do you have client reviews?",
    "What if I don't like the design?",
  ],
  technical: [
    "Will it rank on Google?",
    "Is hosting included?",
    "Can you add a booking form?",
  ],
  browsing: [
    "What kind of websites do you build?",
    "Who is Eclyze for?",
    "How do I get started?",
  ],
};
