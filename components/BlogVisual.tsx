// Auto-generates a distinct "abstract website layout" preview for each
// blog post, deterministically derived from the post's slug. This fills
// the image space on blog cards without needing a hand-made image per
// post — every post gets a different layout + accent + fake domain.

const LAYOUTS = ["hero-grid", "gallery", "sidebar", "stack", "cards"] as const;
const ACCENTS = ["coral", "navy", "gold"] as const;
const DOMAINS = [
  "yourbrand.in",
  "yourstore.com",
  "yourclinic.in",
  "yourshop.in",
  "yourcafe.in",
  "yourbiz.in",
];

type Layout = (typeof LAYOUTS)[number];
type Accent = (typeof ACCENTS)[number];

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: readonly T[], seed: number, salt: number): T {
  return arr[(seed + salt) % arr.length];
}

export function getBlogVisualConfig(slug: string) {
  const seed = hash(slug);
  return {
    layout: pick(LAYOUTS, seed, 0) as Layout,
    accent: pick(ACCENTS, seed, 1) as Accent,
    domain: pick(DOMAINS, seed, 2),
  };
}

const accentClasses: Record<Accent, { solid: string; tint: string; dot: string }> = {
  coral: { solid: "bg-coral", tint: "bg-coral/35", dot: "bg-coral" },
  navy: { solid: "bg-navy", tint: "bg-navy/25", dot: "bg-navy" },
  gold: { solid: "bg-gold", tint: "bg-gold/35", dot: "bg-gold" },
};

export default function BlogVisual({ slug }: { slug: string }) {
  const { layout, accent, domain } = getBlogVisualConfig(slug);
  const { solid, tint } = accentClasses[accent];

  return (
    <div className="h-full w-full border border-line bg-bg overflow-hidden flex flex-col">
      {/* Fake browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-line bg-bg-panel shrink-0">
        <span className="w-2 h-2 rounded-full bg-line-strong" />
        <span className="w-2 h-2 rounded-full bg-line-strong" />
        <span className={`w-2 h-2 rounded-full ${solid}`} />
        <span className="ml-2 font-mono text-[10px] text-ink-faint truncate">
          {domain}
        </span>
      </div>

      {/* Abstract layout preview, varied per post */}
      <div className="flex-1 p-4 space-y-2.5">
        {layout === "hero-grid" && (
          <>
            <div className="h-1/2 bg-bg-panel border border-line" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-8 bg-bg-panel border border-line" />
              <div className={`h-8 border border-line ${tint}`} />
              <div className="h-8 bg-bg-panel border border-line" />
            </div>
          </>
        )}

        {layout === "gallery" && (
          <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`border border-line ${
                  i === 1 || i === 4 ? tint : "bg-bg-panel"
                }`}
              />
            ))}
          </div>
        )}

        {layout === "sidebar" && (
          <div className="flex gap-2 h-full">
            <div className="w-1/4 flex flex-col gap-2">
              <div className={`h-6 border border-line ${tint}`} />
              <div className="h-4 bg-bg-panel border border-line" />
              <div className="h-4 bg-bg-panel border border-line" />
              <div className="h-4 bg-bg-panel border border-line" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-1/2 bg-bg-panel border border-line" />
              <div className="grid grid-cols-2 gap-2 flex-1">
                <div className="bg-bg-panel border border-line" />
                <div className="bg-bg-panel border border-line" />
              </div>
            </div>
          </div>
        )}

        {layout === "stack" && (
          <>
            <div className="h-8 bg-bg-panel border border-line" />
            <div className={`h-2 w-2/3 ${tint}`} />
            <div className="h-2 w-full bg-line-strong" />
            <div className="h-2 w-5/6 bg-line-strong" />
            <div className="h-2 w-1/2 bg-line-strong" />
            <div className="h-10 bg-bg-panel border border-line mt-3" />
          </>
        )}

        {layout === "cards" && (
          <div className="grid grid-cols-2 gap-2 h-full">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-bg-panel border border-line p-2 flex flex-col gap-1.5"
              >
                <span
                  className={`w-2 h-2 rounded-full ${i === 0 ? solid : "bg-line-strong"}`}
                />
                <span className="h-1 w-4/5 bg-line-strong block" />
                <span className="h-1 w-3/5 bg-line-strong block" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
