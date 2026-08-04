import "server-only";

import { cache } from "react";
import { site } from "@/lib/site";
import { GOOGLE_SCRIPT } from "@/lib/google-script-config";
import type { CmsContent, SiteCms } from "@/lib/cms-types";

export function isDriveCmsConfigured() {
  return Boolean(GOOGLE_SCRIPT.url.trim() && GOOGLE_SCRIPT.secret.trim());
}

function scriptUrl() {
  return GOOGLE_SCRIPT.url.trim();
}

function scriptSecret() {
  return GOOGLE_SCRIPT.secret.trim();
}

function defaultCms(): SiteCms {
  const fallbackReviews = [
    {
      quote:
        "We booked Private Chef Lombok for our Senggigi villa. The chef handled everything — shopping, cooking, and clean-up. Best dinner of the trip.",
      name: "Hannah & Mark",
      place: "Villa dinner, Senggigi",
      rating: 5,
      review: "Professional private chef service from start to finish.",
    },
    {
      quote:
        "Six of us near Kuta Lombok. Fresh seafood, clear pricing on WhatsApp, and no restaurant transfers. Exactly what we needed.",
      name: "Priya R.",
      place: "Group booking, South Lombok",
      rating: 5,
      review: "Menus adapted perfectly to our dietary needs.",
    },
    {
      quote:
        "We recommend this private chef service to every guest at our villa. Easy to book and consistently excellent.",
      name: "Villa Amara",
      place: "Villa host, Lombok",
      rating: 5,
      review: "Our guests keep asking for the WhatsApp number.",
    },
    {
      quote:
        "Anniversary dinner on the terrace with a private chef. Quiet, generous portions, and dessert we still talk about.",
      name: "Tomás L.",
      place: "Couple dinner, Mangsit",
      rating: 5,
      review: "Felt like fine dining without leaving the villa.",
    },
    {
      quote:
        "Family of eight including kids. Patient cooking, flexible menu, and great local flavours. Highly recommend for Lombok stays.",
      name: "The Chen family",
      place: "Family villa, Bangsal",
      rating: 4,
      review: "Easy WhatsApp booking and fair value.",
    },
    {
      quote:
        "Booked again for friends arriving the next week. Same private chef service, same standard — arranged in two messages.",
      name: "Sofia & Luca",
      place: "Repeat booking, Kuta Lombok",
      rating: 5,
      review: "Reliable enough that we already rebooked.",
    },
  ];

  const average =
    fallbackReviews.reduce((sum, item) => sum + item.rating, 0) /
    fallbackReviews.length;

  return {
    source: "default",
    name: site.name,
    tagline: site.tagline,
    description: site.description,
    whatsappNumber: site.whatsapp.number,
    whatsappMessage: site.whatsapp.defaultMessage,
    heroImage: site.heroImage,
    aboutImage: site.images.about,
    chefImage: site.images.chef,
    reviews: fallbackReviews,
    average,
    count: fallbackReviews.length,
  };
}

function isReviewVisible(status: string | undefined) {
  const s = String(status ?? "")
    .trim()
    .toLowerCase();
  if (!s) return true;
  return !(
    s === "hide" ||
    s === "hidden" ||
    s === "no" ||
    s === "0" ||
    s === "false" ||
    s === "draft" ||
    s === "off" ||
    s === "pending"
  );
}

function mapContent(payload: CmsContent): SiteCms {
  const s = payload.settings ?? {};
  const reviews = (payload.reviews ?? [])
    .filter((row) => row.quote && row.name && isReviewVisible(row.status))
    .map((row) => ({
      id: row.id,
      quote: row.quote.trim(),
      name: row.name.trim(),
      place: row.place?.trim() || "",
      rating: Math.min(5, Math.max(1, Number(row.rating) || 5)),
      review: row.review?.trim() || "",
    }));

  const fromReviewsAverage = reviews.length
    ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
    : 0;
  const metaAverage = Number(payload.meta?.average);
  const metaCount = Number(payload.meta?.count);

  // Prefer sheet Settings / Apps Script meta (reviews average / count overrides)
  const average = Number.isFinite(metaAverage) ? metaAverage : fromReviewsAverage;
  const count = Number.isFinite(metaCount) ? metaCount : reviews.length;

  return {
    source: "drive",
    name: s.site_name || site.name,
    tagline: s.tagline || site.tagline,
    description: s.description || site.description,
    whatsappNumber: s.whatsapp_number || site.whatsapp.number,
    whatsappMessage: s.whatsapp_message || site.whatsapp.defaultMessage,
    // Local public/ images only — Drive is used for reviews/settings, not media
    heroImage: site.heroImage,
    aboutImage: site.images.about,
    chefImage: site.images.chef,
    reviews,
    average,
    count,
  };
}

async function fetchCmsContent(): Promise<CmsContent | null> {
  if (!isDriveCmsConfigured()) return null;

  const url = new URL(scriptUrl());
  url.searchParams.set("action", "content");
  url.searchParams.set("token", scriptSecret());

  try {
    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as CmsContent;
    if (!data?.ok) return null;
    return data;
  } catch {
    return null;
  }
}

export const getSiteCms = cache(async (): Promise<SiteCms> => {
  const base = defaultCms();
  const remote = await fetchCmsContent();
  if (!remote) return base;

  // Always prefer live Reviews sheet data when Apps Script responds
  return mapContent(remote);
});

export async function callDriveScript<T extends { ok?: boolean; error?: string }>(
  body: Record<string, unknown>,
): Promise<T> {
  if (!isDriveCmsConfigured()) {
    throw new Error("Google Apps Script CMS is not configured.");
  }

  const response = await fetch(scriptUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...body,
      token: scriptSecret(),
    }),
    cache: "no-store",
  });

  const raw = await response.text();
  let data: T;
  try {
    data = JSON.parse(raw) as T;
  } catch {
    throw new Error("Invalid response from Google Apps Script.");
  }

  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "Google Apps Script request failed.");
  }

  return data;
}

export function absoluteMediaUrl(src: string) {
  if (src.startsWith("http")) return src;
  return `${site.url.replace(/\/$/, "")}${src.startsWith("/") ? src : `/${src}`}`;
}
