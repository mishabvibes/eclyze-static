import { NextRequest, NextResponse } from "next/server";
import type { ConversationLog } from "@/lib/chat-types";

/**
 * POST /api/chat/log
 *
 * Called by the ChatWidget when the user closes the widget or after
 * inactivity. Sends the full conversation transcript + accumulated
 * insights to the configured webhook (Discord, Google Sheets, etc.).
 *
 * This endpoint is fire-and-forget from the client's perspective —
 * errors are swallowed so logging never degrades the user experience.
 */
export async function POST(req: NextRequest) {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    // No webhook configured — silently succeed
    return NextResponse.json({ ok: true });
  }

  let log: ConversationLog;
  try {
    log = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  // Basic validation
  if (
    !log.sessionId ||
    !Array.isArray(log.messages) ||
    log.messages.length === 0
  ) {
    return NextResponse.json({ ok: true }); // don't error on empty sessions
  }

  // ── Build a human-readable summary for Discord ────────────────────
  const userMessages = log.messages
    .filter((m) => m.role === "user")
    .map((m) => m.content);

  const intents = (log.insights ?? []).map((i) => i.intent);
  const stages = (log.insights ?? []).map((i) => i.buyerStage);

  // Determine the "hottest" stage reached
  const stageOrder = ["awareness", "consideration", "decision"] as const;
  const hottestStage =
    stageOrder.findLast((s) => stages.includes(s)) ?? "awareness";

  // Most common intent
  const intentCounts: Record<string, number> = {};
  for (const i of intents) {
    intentCounts[i] = (intentCounts[i] ?? 0) + 1;
  }
  const dominantIntent =
    Object.entries(intentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "browsing";

  const durationSec = Math.round((log.durationMs ?? 0) / 1000);
  const converted = log.convertedTo
    ? `✅ Clicked → **${log.convertedTo}**`
    : "❌ No conversion";

  // ── Format for Discord webhook ────────────────────────────────────
  const embed = {
    title: "🧠 New Chat Session",
    color: hottestStage === "decision" ? 0x22c55e : hottestStage === "consideration" ? 0xeab308 : 0x6b7280,
    fields: [
      {
        name: "Session",
        value: `\`${log.sessionId.slice(0, 8)}\` · ${durationSec}s`,
        inline: true,
      },
      {
        name: "Dominant Intent",
        value: dominantIntent.replace("_", " "),
        inline: true,
      },
      {
        name: "Buyer Stage",
        value: hottestStage,
        inline: true,
      },
      {
        name: "Conversion",
        value: converted,
        inline: true,
      },
      {
        name: "Messages",
        value: `${log.messages.length} total (${userMessages.length} from visitor)`,
        inline: true,
      },
      {
        name: "Visitor Questions",
        value:
          userMessages
            .map((m, i) => `${i + 1}. ${m.slice(0, 120)}`)
            .join("\n") || "—",
        inline: false,
      },
    ],
    timestamp: log.timestamp,
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Discord-style payload (also works for generic webhooks)
        embeds: [embed],
        // Include the raw log for non-Discord consumers
        content: undefined,
        _rawLog: log,
      }),
    });
  } catch (err) {
    console.error("Webhook log failed:", err);
  }

  return NextResponse.json({ ok: true });
}
