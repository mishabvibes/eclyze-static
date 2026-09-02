const points = [
  "Greets every visitor and answers the obvious questions — day or night.",
  "Picks up on buying intent and nudges serious visitors to WhatsApp.",
  "Lives on the site itself. No login, no plugin, nothing to manage.",
];

const preview = [
  {
    role: "user" as const,
    content: "Do you build websites for clinics?",
  },
  {
    role: "assistant" as const,
    content:
      "Yes — mobile-first, with a WhatsApp button built in. Want a quick quote for your clinic?",
  },
];

function ChatPreview() {
  return (
    <div className="corner-brackets border border-bg-invert bg-bg-invert text-invert-ink flex flex-col shadow-lg">
      {/* Header — mirrors the real widget's header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-line-strong shrink-0">
        <div className="min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral">
            AI Sales Concierge · Live
          </span>
          <h3 className="font-display font-semibold text-sm mt-0.5">
            Eclyze Concierge
          </h3>
        </div>
        <span className="w-2 h-2 rounded-full bg-coral shrink-0 animate-pulse" />
      </div>

      {/* Messages — mirrors the real widget's bubble styles */}
      <div className="px-4 sm:px-5 py-5 space-y-3">
        {preview.map((m, i) => (
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
              {m.content}
            </div>
          </div>
        ))}
        <div className="flex justify-start">
          <div className="flex items-center gap-1.5 bg-invert-ink/5 px-3.5 py-3 rounded-2xl rounded-bl-md">
            <span className="w-1.5 h-1.5 bg-invert-ink/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-invert-ink/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-invert-ink/50 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      <div className="mt-auto px-5 py-3 border-t border-line-strong">
        <span className="font-mono text-[10px] uppercase tracking-widest text-invert-ink/40">
          This is a preview — the real thing is bottom-right ↘
        </span>
      </div>
    </div>
  );
}

export default function AIConcierge() {
  return (
    <section id="ai-concierge" className="border-b border-line bg-bg-panel/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid md:grid-cols-[1fr_23rem] gap-12 md:gap-10 items-start">
          {/* Left — eyebrow, heading, paragraph, compact point list */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy">
              Built Into Every Site
            </span>
            <h2 className="mt-4 font-display font-semibold text-3xl md:text-4xl max-w-xl leading-tight">
              Your website doesn&apos;t sleep. Neither does your sales
              assistant.
            </h2>
            <p className="mt-4 max-w-xl text-ink-muted leading-relaxed">
              Every Eclyze site can ship with a built-in AI concierge — a
              chat assistant that greets visitors, answers common
              questions, and points serious buyers straight to WhatsApp.
            </p>

            <ul className="mt-10 space-y-4 max-w-xl">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-1 text-coral font-mono text-sm shrink-0">
                    —
                  </span>
                  <span className="text-sm sm:text-[15px] text-ink leading-relaxed">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — live-styled chat mockup, top-aligned with the heading */}
          <div className="w-full md:w-auto">
            <ChatPreview />
          </div>
        </div>
      </div>
    </section>
  );
}