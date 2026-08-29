"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site-config";
import type {
  ChatInsights,
  ChatMessage,
  ConversationLog,
} from "@/lib/chat-types";
import { INTENT_SUGGESTIONS } from "@/lib/chat-types";

// ── Defaults ────────────────────────────────────────────────────────
const DEFAULT_SUGGESTIONS = [
  "What does a website cost?",
  "How fast is delivery?",
  "Do you serve outside Kerala?",
];

const GREETING: ChatMessage = {
  role: "assistant",
  content: `Hi! I'm ${SITE.name}'s AI concierge — ask me about pricing, timelines, or how the process works. (This chat is a live demo of a premium AI add-on we can build into your website too.)`,
};

// ── Helpers ──────────────────────────────────────────────────────────
function generateSessionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadSession(): {
  messages: ChatMessage[];
  insights: ChatInsights[];
  sessionId: string;
  openedAt: number;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("eclyze_chat");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(
  messages: ChatMessage[],
  insights: ChatInsights[],
  sessionId: string,
  openedAt: number
) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      "eclyze_chat",
      JSON.stringify({ messages, insights, sessionId, openedAt })
    );
  } catch {
    // Storage full or blocked — silently fail
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [allInsights, setAllInsights] = useState<ChatInsights[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [openedAt, setOpenedAt] = useState(0);
  const [convertedTo, setConvertedTo] = useState<
    "whatsapp" | "form" | null
  >(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasLoggedRef = useRef(false);

  // Restore session on mount
  useEffect(() => {
    const saved = loadSession();
    if (saved && saved.messages.length > 1) {
      setMessages(saved.messages);
      setAllInsights(saved.insights);
      setSessionId(saved.sessionId);
      setOpenedAt(saved.openedAt);
    } else {
      const id = generateSessionId();
      setSessionId(id);
      setOpenedAt(Date.now());
    }
  }, []);

  // Persist session on every change
  useEffect(() => {
    if (sessionId) {
      saveSession(messages, allInsights, sessionId, openedAt);
    }
  }, [messages, allInsights, sessionId, openedAt]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open, loading]);

  // ── Log session to webhook ──────────────────────────────────────
  const logSession = useCallback(() => {
    if (hasLoggedRef.current) return;
    if (messages.length <= 1) return; // only the greeting — don't log
    hasLoggedRef.current = true;

    const log: ConversationLog = {
      sessionId,
      timestamp: new Date().toISOString(),
      messages,
      insights: allInsights,
      durationMs: Date.now() - openedAt,
      convertedTo,
    };

    // Use sendBeacon for reliability (works even during page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/chat/log",
        new Blob([JSON.stringify(log)], { type: "application/json" })
      );
    } else {
      fetch("/api/chat/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
        keepalive: true,
      }).catch(() => {});
    }
  }, [messages, allInsights, sessionId, openedAt, convertedTo]);

  // Log when widget closes
  useEffect(() => {
    if (!open && messages.length > 1 && !hasLoggedRef.current) {
      logSession();
    }
  }, [open, messages.length, logSession]);

  // Log on page unload (fallback)
  useEffect(() => {
    const handleUnload = () => logSession();
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [logSession]);

  // ── Send message ────────────────────────────────────────────────
  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);
    hasLoggedRef.current = false; // allow re-logging after new messages

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-10),
          sessionId,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply as string,
          contextualButton: (data.insights as ChatInsights)?.contextualButton,
        },
      ]);

      if (data.insights) {
        setAllInsights((prev) => [...prev, data.insights as ChatInsights]);
      }
    } catch {
      setError(
        "Couldn't reach the AI concierge — check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ── Derive dynamic suggestions ──────────────────────────────────
  const latestInsight = allInsights[allInsights.length - 1];
  const suggestions =
    latestInsight && messages.length > 1
      ? latestInsight.suggestedFollowUps?.length
        ? latestInsight.suggestedFollowUps
        : INTENT_SUGGESTIONS[latestInsight.intent] ?? DEFAULT_SUGGESTIONS
      : DEFAULT_SUGGESTIONS;

  // Show soft CTA after 3+ user messages
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const showSoftCta = userMessageCount >= 3;

  // Detect if buyer is in decision stage
  const isDecisionStage = latestInsight?.buyerStage === "decision";

  return (
    <>
      {/* Floating toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-bg-invert text-invert-ink font-mono text-xs uppercase tracking-widest px-5 py-3.5 border border-bg-invert shadow-lg hover:bg-coral hover:text-coral-ink hover:border-coral transition-colors"
      >
        <span className="w-1.5 h-1.5 bg-coral rounded-full animate-pulse-dot" />
        {open ? "Close" : "Ask Eclyze AI"}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[92vw] max-w-sm">
          <div className="corner-brackets border border-bg-invert bg-bg-invert text-invert-ink flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-line-strong">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral">
                  AI Sales Concierge · Live
                </span>
                <h3 className="font-display font-semibold text-sm mt-0.5">
                  {SITE.name} Concierge
                </h3>
              </div>
              {latestInsight && (
                <span className="font-mono text-[9px] uppercase tracking-wider text-invert-ink/40">
                  {latestInsight.buyerStage}
                </span>
              )}
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-4 max-h-96"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-6 text-sm bg-bg-panel text-ink px-3 py-2"
                      : "mr-4 text-sm text-invert-ink/90 leading-relaxed"
                  }
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  {m.contextualButton && (
                    <a
                      href={m.contextualButton.url}
                      onClick={() => setOpen(false)}
                      className="inline-block mt-3 font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-coral text-coral hover:bg-coral hover:text-coral-ink transition-colors"
                    >
                      {m.contextualButton.label} →
                    </a>
                  )}
                </div>
              ))}
              {loading && (
                <div className="mr-4 text-sm text-invert-ink/50 font-mono text-xs">
                  Typing…
                </div>
              )}
              {error && (
                <div className="mr-4 text-xs text-coral font-mono leading-relaxed">
                  {error}
                </div>
              )}
            </div>

            {/* Dynamic suggestions */}
            {!loading && suggestions.length > 0 && (
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-line-strong text-invert-ink/70 hover:border-coral hover:text-coral transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Soft CTA bar — appears after 3+ user messages */}
            {showSoftCta && (
              <div className="px-5 py-3 border-t border-line-strong/50 flex items-center gap-2 flex-wrap">
                {isDecisionStage ? (
                  <>
                    <a
                      href="#intake"
                      onClick={() => {
                        setConvertedTo("form");
                        setOpen(false);
                      }}
                      className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 bg-coral text-coral-ink border border-coral hover:bg-invert-ink hover:text-invert-ink hover:border-invert-ink transition-colors"
                    >
                      Start Project →
                    </a>
                    <a
                      href={`https://wa.me/${SITE.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setConvertedTo("whatsapp")}
                      className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-line-strong text-invert-ink/70 hover:border-coral hover:text-coral transition-colors"
                    >
                      WhatsApp Us
                    </a>
                  </>
                ) : (
                  <>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-invert-ink/40">
                      Ready to go?
                    </span>
                    <a
                      href="#intake"
                      onClick={() => {
                        setConvertedTo("form");
                        setOpen(false);
                      }}
                      className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-line-strong text-invert-ink/70 hover:border-coral hover:text-coral transition-colors"
                    >
                      Fill the Brief
                    </a>
                    <a
                      href={`https://wa.me/${SITE.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setConvertedTo("whatsapp")}
                      className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-line-strong text-invert-ink/70 hover:border-coral hover:text-coral transition-colors"
                    >
                      Chat Human
                    </a>
                  </>
                )}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2 border-t border-line-strong p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 400))}
                placeholder="Ask about pricing, timelines…"
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-invert-ink placeholder:text-invert-ink/40 focus:outline-none px-2 py-2 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="font-mono text-[11px] uppercase tracking-widest bg-coral text-coral-ink px-4 py-2 border border-coral hover:bg-invert-ink hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
