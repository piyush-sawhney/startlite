import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StartLite",
    short_name: "StartLite",
    description:
      "A WhatsApp storefront and cash-flow ledger for Indian micro-businesses.",
    start_url: "/app",
    display: "standalone",
    background_color: "#FBFAF7",
    theme_color: "#12666B",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
