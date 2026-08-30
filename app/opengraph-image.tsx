import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.name} — Affordable Websites, Built to Convert`;

const COLORS = {
  bg: "#FAF7F1",
  panel: "#F1EBDF",
  ink: "#14161B",
  inkMuted: "#585C65",
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
          position: "relative",
        }}
      >
        {/* faint vertical rule accents */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 90,
            width: 1,
            height: "100%",
            background: COLORS.line,
          }}
        />

        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 16,
              height: 16,
              background: COLORS.coral,
            }}
          />
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

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: `1.5px solid ${COLORS.navy}`,
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
                background: COLORS.coral,
              }}
            />
            <span
              style={{
                fontSize: 15,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: COLORS.navy,
                fontWeight: 600,
              }}
            >
              Affordable Website Design, Kerala &amp; India
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -1,
              color: COLORS.ink,
            }}
          >
            A Website That Actually{" "}
            <span style={{ color: COLORS.navy, marginLeft: 14 }}>
              Brings You Customers
            </span>
          </div>
        </div>

        {/* Bottom stat strip */}
        <div style={{ display: "flex", gap: 1, background: COLORS.line }}>
          {[
            { label: "Flat Fee", value: SITE.priceDisplay },
            { label: "Delivery", value: "5 Working Days" },
            { label: "Built For", value: "Mobile + SEO" },
            { label: "Serving", value: "Kerala & India" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                background: COLORS.bg,
                padding: "18px 26px",
                flex: 1,
              }}
            >
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLORS.ink,
                }}
              >
                {item.value}
              </span>
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: COLORS.inkFaint,
                  marginTop: 4,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
