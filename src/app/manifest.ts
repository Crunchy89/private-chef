import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Private Chef Lombok",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f4ee",
    theme_color: "#d4a05a",
    lang: "en",
    icons: [
      {
        src: "/images/hero.webp",
        type: "image/webp",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
