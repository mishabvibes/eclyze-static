import { SITE } from "@/lib/site-config";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export const OG_COLORS = {
  bg: "#FAF7F1",
  panel: "#F1EBDF",
  ink: "#14161B",
  inkMuted: "#585C65",
  inkFaint: "#8A8D95",
  navy: "#1C3766",
  coral: "#FF5B35",
  line: "rgba(20,22,27,0.14)",
};

/**
 * Shared OG-card layout used by the 4 landing pages' opengraph-image.tsx
 * routes. Mirrors the visual style of the homepage / blog OG images
 * (app/opengraph-image.tsx, app/blog/opengraph-image.tsx) so every social
 * share looks like it belongs to the same site.
 */
export function OgCard({
  eyebrow,
  headline,
}: {
  eyebrow: string;
  headline: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: OG_COLORS.bg,
        padding: "64px 72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 16, height: 16, background: OG_COLORS.coral }} />
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: -0.5,
            color: OG_COLORS.ink,
          }}
        >
          {SITE.name}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: `1.5px solid ${OG_COLORS.navy}`,
            padding: "6px 16px",
            marginBottom: 28,
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: OG_COLORS.coral,
            }}
          />
          <span
            style={{
              fontSize: 15,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: OG_COLORS.navy,
              fontWeight: 600,
            }}
          >
            {eyebrow}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -1,
            color: OG_COLORS.ink,
          }}
        >
          {headline}
        </div>
      </div>

      <div style={{ display: "flex", gap: 1, background: OG_COLORS.line }}>
        {[
          { label: "Flat Fee", value: SITE.priceDisplay },
          { label: "Delivery", value: `${SITE.deliveryDays} Working Days` },
          { label: "Built For", value: "Mobile + SEO" },
          { label: "Serving", value: "Kerala & India" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              flexDirection: "column",
              background: OG_COLORS.bg,
              padding: "18px 26px",
              flex: 1,
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: OG_COLORS.ink }}>
              {item.value}
            </span>
            <span
              style={{
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: OG_COLORS.inkFaint,
                marginTop: 4,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
