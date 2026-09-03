import { ImageResponse } from "next/og";
import { OgCard, ogImageSize as size, ogImageContentType as contentType } from "@/lib/og-image";

export { size, contentType };
export const alt = "Website Design in Kochi & Across Kerala | Eclyze";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Website Design in Kerala"
        headline="Website design in Kochi and everywhere else in Kerala."
      />
    ),
    { ...size }
  );
}
