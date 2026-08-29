"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site-config";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What does a website cost?",
  "How fast is delivery?",
  "Do you serve outside Kerala?",
];

const GREETING: Message = {
  role: "assistant",
  content: `Hi, I'm ${SITE.name}'s AI concierge — ask me about pricing, timelines, or how the process works. (This chat is a live demo of a premium AI add-on we can build into your website too.)`,
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open, loading]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-8) }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply as string },
      ]);
    } catch {
      setError(
        "Couldn't reach the AI concierge — check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

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
                Premium AI · Live Demo
              </span>
              <h3 className="font-display font-semibold text-sm mt-0.5">
                {SITE.name} Concierge
              </h3>
            </div>
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
                {m.content}
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

          {/* Suggestions (only before the conversation gets going) */}
          {messages.length === 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
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
