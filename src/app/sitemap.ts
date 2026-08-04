import type { MetadataRoute } from "next";
import { areas } from "@/lib/seo-content";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absoluteUrl(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/how-to-book"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...areas.map((area) => ({
      url: absoluteUrl(`/${area.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
