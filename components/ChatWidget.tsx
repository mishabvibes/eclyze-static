"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
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

const MOBILE_QUERY = "(max-width: 639px)";

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
  discordMessageId?: string;
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
  openedAt: number,
  discordMessageId?: string
) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      "eclyze_chat",
      JSON.stringify({ messages, insights, sessionId, openedAt, discordMessageId })
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [convertedTo, setConvertedTo] = useState<
    "whatsapp" | "form" | null
  >(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasLoggedRef = useRef(false);
  const prevMessagesLengthRef = useRef(1);
  const lastUserMessageRef = useRef("");
  // Discord message id for this session's webhook log, if one has
  // already been posted. Once set, later logs EDIT that same message
  // instead of posting a new one — prevents duplicate Discord posts
  // when the widget is opened/closed multiple times in one session.
  const discordMessageIdRef = useRef<string | undefined>(undefined);

  // Restore session on mount
  useEffect(() => {
    const saved = loadSession();
    if (saved && saved.messages.length > 1) {
      setMessages(saved.messages);
      setAllInsights(saved.insights);
      setSessionId(saved.sessionId);
      setOpenedAt(saved.openedAt);
      prevMessagesLengthRef.current = saved.messages.length;
      discordMessageIdRef.current = saved.discordMessageId;
    } else {
      const id = generateSessionId();
      setSessionId(id);
      setOpenedAt(Date.now());
    }
  }, []);

  // Persist session on every change
  useEffect(() => {
    if (sessionId) {
      saveSession(messages, allInsights, sessionId, openedAt, discordMessageIdRef.current);
    }
  }, [messages, allInsights, sessionId, openedAt]);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, loading]);

  // Track unread assistant replies while the widget is closed
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      const added = messages.slice(prevMessagesLengthRef.current);
      const newAssistantMsgs = added.filter((m) => m.role === "assistant").length;
      if (!open && newAssistantMsgs > 0) {
        setUnreadCount((c) => c + newAssistantMsgs);
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, open]);

  // Focus input when opened; lock body scroll on mobile
  useEffect(() => {
    if (open) {
      const isMobile =
        typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches;
      const t = setTimeout(() => {
        if (!isMobile) inputRef.current?.focus();
      }, 150);

      let previousOverflow = "";
      if (isMobile) {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }

      return () => {
        clearTimeout(t);
        if (isMobile) document.body.style.overflow = previousOverflow;
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  // ── Log session to webhook ──────────────────────────────────────
  // One Discord message per session: the first call creates it and
  // remembers its id; every call after that edits the same message
  // (via discordMessageIdRef) instead of posting a new, overlapping
  // one — so re-opening/closing the widget never causes duplicates.
  const logSession = useCallback(
    (isUnloading: boolean) => {
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
        discordMessageId: discordMessageIdRef.current,
      };
      const body = JSON.stringify(log);

      if (isUnloading) {
        // Page is actually closing — can't wait for a response, so
        // fire-and-forget with sendBeacon for reliability. The
        // remembered discordMessageId (if any) still lets the server
        // edit the existing message rather than duplicate it.
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/chat/log",
            new Blob([body], { type: "application/json" })
          );
        } else {
          fetch("/api/chat/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
          }).catch(() => {});
        }
        return;
      }

      // Normal widget-close — use a regular fetch so we can capture
      // the Discord message id back and reuse it next time.
      fetch("/api/chat/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.discordMessageId) {
            discordMessageIdRef.current = data.discordMessageId;
            saveSession(messages, allInsights, sessionId, openedAt, data.discordMessageId);
          }
        })
        .catch(() => {});
    },
    [messages, allInsights, sessionId, openedAt, convertedTo]
  );

  // Log when widget closes
  useEffect(() => {
    if (!open && messages.length > 1 && !hasLoggedRef.current) {
      logSession(false);
    }
  }, [open, messages.length, logSession]);

  // Log on page unload (fallback)
  useEffect(() => {
    const handleUnload = () => logSession(true);
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [logSession]);

  // ── Send message ────────────────────────────────────────────────
  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    lastUserMessageRef.current = content;

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
        onClick={() =>
          setOpen((v) => {
            const next = !v;
            if (next) setUnreadCount(0);
            return next;
          })
        }
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        aria-expanded={open}
        aria-controls="eclyze-chat-panel"
        className="fixed z-50 flex items-center gap-2 bg-bg-invert text-invert-ink font-mono text-xs uppercase tracking-widest px-5 py-3.5 border border-bg-invert shadow-lg hover:bg-coral hover:text-coral-ink hover:border-coral transition-colors touch-manipulation"
        style={{
          bottom: "max(1.25rem, env(safe-area-inset-bottom))",
          right: "max(1.25rem, env(safe-area-inset-right))",
        }}
      >
        <span className="w-1.5 h-1.5 bg-coral rounded-full animate-pulse-dot" />
        {open ? "Close" : "Ask Eclyze AI"}
        {!open && unreadCount > 0 && (
          <span
            aria-label={`${unreadCount} new message${unreadCount > 1 ? "s" : ""}`}
            className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-coral text-coral-ink text-[10px] font-mono font-bold border-2 border-bg"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Overlay (mobile only, dims page behind full-screen sheet) */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-bg-invert/40 transition-opacity duration-200 sm:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        id="eclyze-chat-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${SITE.name} AI chat assistant`}
        className={`fixed z-50 inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-[min(24rem,calc(100vw-2rem))] h-[100dvh] sm:h-auto sm:max-h-[min(38rem,calc(100dvh-7rem))] transition-all duration-200 ease-out ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 sm:translate-y-2 pointer-events-none"
        }`}
      >
        <div className="corner-brackets sm:border border-bg-invert bg-bg-invert text-invert-ink flex flex-col shadow-2xl w-full h-full sm:max-h-[min(38rem,calc(100dvh-7rem))]">
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b border-line-strong shrink-0"
            style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
          >
            <div className="min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral">
                AI Sales Concierge · Live
              </span>
              <h3 className="font-display font-semibold text-sm mt-0.5 truncate">
                {SITE.name} Concierge
              </h3>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {latestInsight && (
                <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-wider text-invert-ink/40">
                  {latestInsight.buyerStage}
                </span>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex items-center justify-center w-8 h-8 -mr-1.5 text-invert-ink/60 hover:text-coral transition-colors touch-manipulation"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-4 space-y-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] text-sm bg-bg-panel text-ink px-3.5 py-2.5 rounded-2xl rounded-br-md"
                      : "max-w-[90%] text-sm text-invert-ink/90 leading-relaxed bg-invert-ink/5 px-3.5 py-2.5 rounded-2xl rounded-bl-md"
                  }
                >
                  <div className="whitespace-pre-wrap break-words">{m.content}</div>
                  {m.contextualButton && (
                    <a
                      href={m.contextualButton.url}
                      onClick={() => setOpen(false)}
                      className="inline-block mt-3 font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-coral text-coral hover:bg-coral hover:text-coral-ink transition-colors touch-manipulation"
                    >
                      {m.contextualButton.label} →
                    </a>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1.5 bg-invert-ink/5 px-3.5 py-3 rounded-2xl rounded-bl-md"
                  aria-label="Assistant is typing"
                >
                  <span className="w-1.5 h-1.5 bg-invert-ink/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-invert-ink/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-invert-ink/50 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-start">
                <div className="max-w-[90%] text-xs text-coral font-mono leading-relaxed bg-coral/10 px-3.5 py-2.5 rounded-2xl rounded-bl-md">
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={() => sendMessage(lastUserMessageRef.current)}
                    className="mt-2 uppercase tracking-wider underline underline-offset-2 hover:text-invert-ink transition-colors touch-manipulation"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic suggestions */}
          {!loading && suggestions.length > 0 && (
            <div className="px-4 sm:px-5 pb-3 flex flex-wrap gap-2 shrink-0">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendMessage(s)}
                  className="font-mono text-[10px] uppercase tracking-wider px-3 py-2 border border-line-strong text-invert-ink/70 hover:border-coral hover:text-coral transition-colors touch-manipulation min-h-[36px]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Soft CTA bar — appears after 3+ user messages */}
          {showSoftCta && (
            <div className="px-4 sm:px-5 py-3 border-t border-line-strong/50 flex items-center gap-2 flex-wrap shrink-0">
              {isDecisionStage ? (
                <>
                  <Link
                    href="/#intake"
                    onClick={() => {
                      setConvertedTo("form");
                      setOpen(false);
                    }}
                    className="font-mono text-[10px] uppercase tracking-wider px-3 py-2 bg-coral text-coral-ink border border-coral hover:bg-invert-ink hover:text-invert-ink hover:border-invert-ink transition-colors touch-manipulation min-h-[36px] flex items-center"
                  >
                    Start Project →
                  </Link>
                  <a
                    href={`https://wa.me/${SITE.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setConvertedTo("whatsapp")}
                    className="font-mono text-[10px] uppercase tracking-wider px-3 py-2 border border-line-strong text-invert-ink/70 hover:border-coral hover:text-coral transition-colors touch-manipulation min-h-[36px] flex items-center"
                  >
                    WhatsApp Us
                  </a>
                </>
              ) : (
                <>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-invert-ink/40 w-full sm:w-auto">
                    Ready to go?
                  </span>
                  <Link
                    href="/#intake"
                    onClick={() => {
                      setConvertedTo("form");
                      setOpen(false);
                    }}
                    className="font-mono text-[10px] uppercase tracking-wider px-3 py-2 border border-line-strong text-invert-ink/70 hover:border-coral hover:text-coral transition-colors touch-manipulation min-h-[36px] flex items-center"
                  >
                    Fill the Brief
                  </Link>
                  <a
                    href={`https://wa.me/${SITE.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setConvertedTo("whatsapp")}
                    className="font-mono text-[10px] uppercase tracking-wider px-3 py-2 border border-line-strong text-invert-ink/70 hover:border-coral hover:text-coral transition-colors touch-manipulation min-h-[36px] flex items-center"
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
            className="flex items-center gap-2 border-t border-line-strong p-3 shrink-0"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 400))}
              placeholder="Ask about pricing, timelines…"
              disabled={loading}
              enterKeyHint="send"
              autoComplete="off"
              className="flex-1 min-w-0 bg-transparent text-base sm:text-sm text-invert-ink placeholder:text-invert-ink/40 focus:outline-none px-2 py-2.5 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="font-mono text-[11px] uppercase tracking-widest bg-coral text-coral-ink px-4 py-2.5 border border-coral hover:bg-invert-ink hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation shrink-0"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
