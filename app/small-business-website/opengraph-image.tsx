import { ImageResponse } from "next/og";
import { OgCard, ogImageSize as size, ogImageContentType as contentType } from "@/lib/og-image";

export { size, contentType };
export const alt = "Website for Small Business in Kerala & India | Eclyze";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="For Small Businesses"
        headline="A website built for how small businesses actually work."
      />
    ),
    { ...size }
  );
}
