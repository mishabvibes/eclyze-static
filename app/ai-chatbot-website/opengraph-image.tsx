import { ImageResponse } from "next/og";
import { OgCard, ogImageSize as size, ogImageContentType as contentType } from "@/lib/og-image";

export { size, contentType };
export const alt = "Website with a Built-in AI Chat Assistant | Eclyze";

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="AI-Powered Websites"
        headline="A website with an AI chat assistant built in."
      />
    ),
    { ...size }
  );
}
