import "server-only";

import { cache } from "react";
import { getSiteSettings } from "@/lib/admin-db";
import { site } from "@/lib/site";
import {
  getReviewsMeta,
  listVisibleReviews,
} from "@/lib/reviews-db";
import type { SiteCms } from "@/lib/cms-types";

export function absoluteMediaUrl(src: string) {
  if (src.startsWith("http")) return src;
  return `${site.url.replace(/\/$/, "")}${src.startsWith("/") ? src : `/${src}`}`;
}

export const getSiteCms = cache(async (): Promise<SiteCms> => {
  const [rows, settings] = await Promise.all([
    listVisibleReviews(),
    getSiteSettings(),
  ]);
  const reviews = rows.map((row) => ({
    id: row.id,
    quote: row.quote,
    name: row.name,
    place: row.place,
    rating: row.rating,
    review: row.review,
  }));
  const meta = getReviewsMeta(rows);

  return {
    source: "turso",
    name: settings.site_name || site.name,
    tagline: site.tagline,
    description: site.description,
    whatsappNumber: settings.whatsapp_number || site.whatsapp.number,
    whatsappMessage: site.whatsapp.defaultMessage,
    location: {
      label: settings.location_label || site.location.label,
      address: settings.location_address || site.location.address,
      lat: Number.isFinite(settings.location_lat)
        ? settings.location_lat
        : site.location.lat,
      lng: Number.isFinite(settings.location_lng)
        ? settings.location_lng
        : site.location.lng,
      mapsLink: settings.maps_link || site.location.mapsLink,
    },
    heroImage: site.heroImage,
    aboutImage: site.images.about,
    chefImage: site.images.chef,
    content: {
      heroTitle: settings.hero_title,
      heroSubtitle: settings.hero_subtitle,
      aboutTitleLead: settings.about_title_lead,
      aboutTitleRest: settings.about_title_rest,
      aboutBody: settings.about_body,
      chefTitleLead: settings.chef_title_lead,
      chefTitleRest: settings.chef_title_rest,
      chefBody: settings.chef_body,
      reviewsTitleLead: settings.reviews_title_lead,
      reviewsTitleRest: settings.reviews_title_rest,
      reviewsBody: settings.reviews_body,
      locationTitleLead: settings.location_title_lead,
      locationTitleRest: settings.location_title_rest,
    },
    reviews,
    average: meta.average,
    count: meta.count,
  };
});
