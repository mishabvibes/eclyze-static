import { ImageResponse } from "next/og";
import { OgCard, ogImageSize as size, ogImageContentType as contentType } from "@/lib/og-image";

export { size, contentType };
export const alt = "Website Cost in Kerala — 2026 Pricing Guide | Eclyze";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Pricing Guide"
        headline="How much does a website actually cost in Kerala?"
      />
    ),
    { ...size }
  );
}
