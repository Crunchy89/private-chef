import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteCms } from "@/lib/site-cms";
import {
  createReview,
  deleteReview,
  normalizeStatus,
  updateReview,
  type ReviewStatus,
} from "@/lib/reviews-db";

export const runtime = "nodejs";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

type ReviewBody = {
  id?: string;
  name?: string;
  quote?: string;
  place?: string;
  rating?: number | string;
  review?: string;
  photo_url?: string;
  status?: string | number | boolean;
  website?: string;
};

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

function parseStatus(value: unknown): ReviewStatus | null {
  if (value == null || value === "") return null;
  return normalizeStatus(value, 0);
}

function parseRating(value: unknown) {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return null;
  const rounded = Math.round(rating);
  if (rounded < 1 || rounded > 5) return null;
  return rounded;
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/secret/admin");
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
  const isAdmin = await isAdminAuthenticated();

  if (!name || !quote || !rating) {
    return NextResponse.json(
      { ok: false, error: "Name, quote, and rating are required." },
      { status: 400 },
    );
  }

  try {
    const row = await createReview({
      name,
      quote,
      place,
      review,
      rating,
      photo_url: clean(body.photo_url, 500),
      // Public submissions stay hidden; admins can set show/hide.
      status: isAdmin ? (parseStatus(body.status) ?? 1) : 0,
    });
    refresh();
    return NextResponse.json({ ok: true, id: row.id, status: row.status });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not save review.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

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
    const row = await updateReview(id, {
      name: body.name != null ? clean(body.name, 80) : undefined,
      quote: body.quote != null ? clean(body.quote, 500) : undefined,
      place: body.place != null ? clean(body.place, 120) : undefined,
      review: body.review != null ? clean(body.review, 500) : undefined,
      rating: body.rating != null ? parseRating(body.rating) ?? undefined : undefined,
      photo_url: body.photo_url != null ? clean(body.photo_url, 500) : undefined,
      status: body.status != null ? parseStatus(body.status) ?? undefined : undefined,
    });

    if (!row) {
      return NextResponse.json({ ok: false, error: "Review not found." }, { status: 404 });
    }

    refresh();
    return NextResponse.json({ ok: true, id: row.id, status: row.status });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not update review.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

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
    const ok = await deleteReview(id);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Review not found." }, { status: 404 });
    }
    refresh();
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not delete review.",
      },
      { status: 500 },
    );
  }
}
