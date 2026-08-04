import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  callDriveScript,
  getSiteCms,
  isDriveCmsConfigured,
} from "@/lib/drive-cms";

type ReviewBody = {
  id?: string;
  name?: string;
  quote?: string;
  place?: string;
  rating?: number | string;
  review?: string;
  photo_url?: string;
  status?: string;
  website?: string;
};

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

function parseStatus(value: unknown): "show" | "hide" | null {
  if (value == null || value === "") return null;
  const s = String(value).trim().toLowerCase();
  if (
    s === "hide" ||
    s === "hidden" ||
    s === "no" ||
    s === "0" ||
    s === "false" ||
    s === "draft" ||
    s === "off" ||
    s === "pending"
  ) {
    return "hide";
  }
  if (
    s === "show" ||
    s === "published" ||
    s === "yes" ||
    s === "1" ||
    s === "true" ||
    s === "on"
  ) {
    return "show";
  }
  return null;
}

function parseRating(value: unknown) {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return null;
  const rounded = Math.round(rating);
  if (rounded < 1 || rounded > 5) return null;
  return rounded;
}

function refreshCmsCache() {
  revalidatePath("/");
}

export async function GET() {
  const content = await getSiteCms();
  return NextResponse.json({
    ok: true,
    source: content.source,
    reviews: content.reviews,
    average: content.average,
    count: content.count,
  });
}

export async function POST(request: Request) {
  if (!isDriveCmsConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Review submissions are not configured." },
      { status: 503 },
    );
  }

  let body: ReviewBody;
  try {
    body = (await request.json()) as ReviewBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 80);
  const quote = clean(body.quote, 500);
  const place = clean(body.place, 120);
  const review = clean(body.review, 500);
  const rating = parseRating(body.rating);

  if (!name || !quote || !rating) {
    return NextResponse.json(
      { ok: false, error: "Name, quote, and rating are required." },
      { status: 400 },
    );
  }

  try {
    const result = await callDriveScript<{ ok: boolean; id?: string }>({
      action: "create",
      name,
      quote,
      place,
      review,
      rating,
      photo_url: clean(body.photo_url, 500),
      // New public submissions stay hidden until set to "show" in the sheet
      status: parseStatus(body.status) ?? "hide",
    });

    refreshCmsCache();
    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not save review.",
      },
      { status: 502 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!isDriveCmsConfigured()) {
    return NextResponse.json(
      { ok: false, error: "CMS is not configured." },
      { status: 503 },
    );
  }

  let body: ReviewBody;
  try {
    body = (await request.json()) as ReviewBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const id = clean(body.id, 80);
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });
  }

  try {
    await callDriveScript({
      action: "update",
      id,
      name: body.name != null ? clean(body.name, 80) : undefined,
      quote: body.quote != null ? clean(body.quote, 500) : undefined,
      place: body.place != null ? clean(body.place, 120) : undefined,
      review: body.review != null ? clean(body.review, 500) : undefined,
      rating: body.rating != null ? parseRating(body.rating) : undefined,
      photo_url: body.photo_url != null ? clean(body.photo_url, 500) : undefined,
      status: body.status != null ? parseStatus(body.status) ?? undefined : undefined,
    });

    refreshCmsCache();
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not update review.",
      },
      { status: 502 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isDriveCmsConfigured()) {
    return NextResponse.json(
      { ok: false, error: "CMS is not configured." },
      { status: 503 },
    );
  }

  let body: ReviewBody;
  try {
    body = (await request.json()) as ReviewBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const id = clean(body.id, 80);
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });
  }

  try {
    await callDriveScript({ action: "delete", id });
    refreshCmsCache();
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not delete review.",
      },
      { status: 502 },
    );
  }
}
