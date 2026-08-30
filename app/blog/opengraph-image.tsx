import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.name} Blog`;

const COLORS = {
  bg: "#FAF7F1",
  panel: "#F1EBDF",
  ink: "#14161B",
  inkFaint: "#8A8D95",
  navy: "#1C3766",
  coral: "#FF5B35",
  line: "rgba(20,22,27,0.14)",
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: COLORS.bg,
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 16, height: 16, background: COLORS.coral }} />
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: -0.5,
              color: COLORS.ink,
            }}
          >
            {SITE.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
          <span
            style={{
              fontSize: 15,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: COLORS.navy,
              fontWeight: 600,
              marginBottom: 22,
            }}
          >
            {SITE.name} Blog
          </span>
          <div
            style={{
              display: "flex",
              fontSize: 58,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -1,
              color: COLORS.ink,
            }}
          >
            Straight talk on websites, pricing, and getting found online.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1.5px solid ${COLORS.line}`,
              padding: "10px 18px",
            }}
          >
            <div style={{ width: 8, height: 8, background: COLORS.coral }} />
            <span
              style={{
                fontSize: 15,
                color: COLORS.inkFaint,
                letterSpacing: 1,
              }}
            >
              No jargon, no fluff — just what Kerala business owners need
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
