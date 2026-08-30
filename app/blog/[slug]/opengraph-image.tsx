import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";
import { getBlogVisualConfig } from "@/components/BlogVisual";
import { SITE } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = {
  bg: "#FAF7F1",
  panel: "#F1EBDF",
  ink: "#14161B",
  inkFaint: "#8A8D95",
  navy: "#1C3766",
  coral: "#FF5B35",
  gold: "#C9962F",
  line: "rgba(20,22,27,0.14)",
};

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return [
    {
      id: "post",
      size,
      contentType,
      alt: post ? post.title : `${SITE.name} Blog`,
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? `${SITE.name} Blog`;
  const meta = post
    ? `${new Date(post.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })} · ${post.readingTime}`
    : "";

  const { accent } = getBlogVisualConfig(slug);
  const accentColor =
    accent === "coral" ? COLORS.coral : accent === "gold" ? COLORS.gold : COLORS.navy;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: COLORS.bg,
          fontFamily: "sans-serif",
        }}
      >
        {/* Left: text content */}
        <div
          style={{
            width: "62%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 56px 56px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 16, height: 16, background: COLORS.coral }} />
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: -0.5,
                color: COLORS.ink,
              }}
            >
              {SITE.name}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {meta && (
              <span
                style={{
                  fontSize: 15,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: accentColor,
                  fontWeight: 600,
                  marginBottom: 18,
                }}
              >
                {meta}
              </span>
            )}
            <div
              style={{
                display: "flex",
                fontSize: title.length > 60 ? 42 : 50,
                fontWeight: 700,
                lineHeight: 1.18,
                letterSpacing: -0.5,
                color: COLORS.ink,
              }}
            >
              {title}
            </div>
          </div>

          <span
            style={{
              fontSize: 15,
              letterSpacing: 1,
              color: COLORS.inkFaint,
            }}
          >
            {SITE.priceDisplay} flat · live in {SITE.deliveryDays} days
          </span>
        </div>

        {/* Right: abstract layout visual, matching site's mockup style */}
        <div
          style={{
            width: "38%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: COLORS.panel,
            borderLeft: `1px solid ${COLORS.line}`,
          }}
        >
          <div
            style={{
              width: "80%",
              display: "flex",
              flexDirection: "column",
              background: COLORS.bg,
              border: `1px solid ${COLORS.line}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 14px",
                borderBottom: `1px solid ${COLORS.line}`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "rgba(20,22,27,0.24)",
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "rgba(20,22,27,0.24)",
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: accentColor,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: 18,
              }}
            >
              <div style={{ height: 44, background: COLORS.panel }} />
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, height: 28, background: COLORS.panel }} />
                <div
                  style={{
                    flex: 1,
                    height: 28,
                    background: `${accentColor}59`,
                  }}
                />
                <div style={{ flex: 1, height: 28, background: COLORS.panel }} />
              </div>
              <div style={{ height: 8, width: "70%", background: "rgba(20,22,27,0.24)" }} />
              <div style={{ height: 8, width: "45%", background: "rgba(20,22,27,0.24)" }} />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
