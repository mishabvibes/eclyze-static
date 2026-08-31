"use client";

import dynamic from "next/dynamic";

// Wrapping the ssr:false dynamic import in its own Client Component lets
// Server Component pages (app/page.tsx, app/blog/page.tsx, etc.) lazy-load
// the chat widget without pulling its ~20KB of client JS into the initial
// server-rendered bundle. next/dynamic with ssr:false is only permitted
// inside a Client Component in the App Router, hence this small wrapper.
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), {
  ssr: false,
});

export default ChatWidget;
