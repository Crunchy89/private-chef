import "server-only";

import { randomUUID } from "node:crypto";
import { createClient, type Client, type Row } from "@libsql/client";
import { config } from "@/config";

/** 1 = visible on site, 0 = hidden */
export type ReviewStatus = 0 | 1;

export type ReviewRow = {
  id: string;
  quote: string;
  name: string;
  place: string;
  rating: number;
  review: string;
  photo_url: string;
  status: ReviewStatus;
  created_at: string;
};

export type ReviewInput = {
  id?: string;
  quote: string;
  name: string;
  place?: string;
  rating?: number;
  review?: string;
  photo_url?: string;
  status?: ReviewStatus | string | number | boolean;
};

const globalForDb = globalThis as unknown as {
  __privateChefTurso?: Client;
  __privateChefTursoReady?: Promise<void>;
};

export function getTurso() {
  if (globalForDb.__privateChefTurso) return globalForDb.__privateChefTurso;

  const { databaseUrl, authToken } = config.turso;
  if (!databaseUrl || !authToken) {
    throw new Error("Missing Turso config in src/config.ts");
  }

  const client = createClient({
    url: databaseUrl,
    authToken,
  });

  globalForDb.__privateChefTurso = client;
  return client;
}

async function ensureSchema() {
  if (!globalForDb.__privateChefTursoReady) {
    globalForDb.__privateChefTursoReady = (async () => {
      const db = getTurso();
      await db.batch(
        [
          `CREATE TABLE IF NOT EXISTS reviews (
            id TEXT PRIMARY KEY NOT NULL,
            quote TEXT NOT NULL,
            name TEXT NOT NULL,
            place TEXT NOT NULL DEFAULT '',
            rating INTEGER NOT NULL DEFAULT 5,
            review TEXT NOT NULL DEFAULT '',
            photo_url TEXT NOT NULL DEFAULT '',
            status INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
          )`,
          `CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status)`,
          `CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at)`,
        ],
        "write",
      );

      // Normalize legacy text/float status values, then rebuild the column as INTEGER.
      // SQLite/Turso cannot ALTER column type in place; recreate the table once.
      await db.execute(`
        UPDATE reviews SET status = CASE
          WHEN typeof(status) = 'integer' AND status = 1 THEN 1
          WHEN typeof(status) = 'real' AND status >= 0.5 THEN 1
          WHEN lower(trim(cast(status as text))) IN (
            '1', '1.0', 'show', 'published', 'yes', 'true', 'on'
          ) THEN 1
          WHEN cast(status as real) >= 0.5 THEN 1
          ELSE 0
        END
      `);

      const info = await db.execute(`PRAGMA table_info(reviews)`);
      const statusCol = info.rows.find((row) => String(row.name) === "status");
      const statusType = String(statusCol?.type ?? "").toUpperCase();

      if (statusType !== "INTEGER") {
        await db.batch(
          [
            `CREATE TABLE IF NOT EXISTS reviews_status_int (
              id TEXT PRIMARY KEY NOT NULL,
              quote TEXT NOT NULL,
              name TEXT NOT NULL,
              place TEXT NOT NULL DEFAULT '',
              rating INTEGER NOT NULL DEFAULT 5,
              review TEXT NOT NULL DEFAULT '',
              photo_url TEXT NOT NULL DEFAULT '',
              status INTEGER NOT NULL DEFAULT 0,
              created_at TEXT NOT NULL
            )`,
            `INSERT OR REPLACE INTO reviews_status_int
              (id, quote, name, place, rating, review, photo_url, status, created_at)
             SELECT
              id, quote, name, place, rating, review, photo_url,
              CASE WHEN cast(status as real) >= 0.5 THEN 1 ELSE 0 END,
              created_at
             FROM reviews`,
            `DROP TABLE reviews`,
            `ALTER TABLE reviews_status_int RENAME TO reviews`,
            `CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status)`,
            `CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at)`,
          ],
          "write",
        );
      }
    })();
  }
  await globalForDb.__privateChefTursoReady;
}

function clampRating(value: number | undefined) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 5;
  return Math.min(5, Math.max(1, Math.round(n)));
}

/** Normalize any legacy/API value to integer 1 (show) or 0 (hide). */
export function normalizeStatus(
  value: unknown,
  fallback: ReviewStatus,
): ReviewStatus {
  if (value === true) return 1;
  if (value === false) return 0;
  if (typeof value === "bigint") return value === BigInt(0) ? 0 : 1;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value >= 0.5 ? 1 : 0;
  }

  const s = String(value ?? "")
    .trim()
    .toLowerCase();
  if (!s) return fallback;

  if (/^[+-]?\d+(\.\d+)?$/.test(s)) {
    return Number(s) >= 0.5 ? 1 : 0;
  }

  if (
    s === "hide" ||
    s === "hidden" ||
    s === "no" ||
    s === "false" ||
    s === "draft" ||
    s === "off" ||
    s === "pending"
  ) {
    return 0;
  }
  if (
    s === "show" ||
    s === "published" ||
    s === "yes" ||
    s === "true" ||
    s === "on"
  ) {
    return 1;
  }
  return fallback;
}

/** Always bind status as a SQL INTEGER (JS number can become REAL/0.0 in Turso). */
function statusInt(value: ReviewStatus): bigint {
  return value === 1 ? BigInt(1) : BigInt(0);
}

function mapRow(row: Row): ReviewRow {
  return {
    id: String(row.id ?? ""),
    quote: String(row.quote ?? ""),
    name: String(row.name ?? ""),
    place: String(row.place ?? ""),
    rating: clampRating(Number(row.rating)),
    review: String(row.review ?? ""),
    photo_url: String(row.photo_url ?? ""),
    status: normalizeStatus(row.status, 0),
    created_at: String(row.created_at ?? ""),
  };
}

export async function listVisibleReviews(): Promise<ReviewRow[]> {
  await ensureSchema();
  const result = await getTurso().execute(`
    SELECT id, quote, name, place, rating, review, photo_url, status, created_at
    FROM reviews
    WHERE status = 1
    ORDER BY datetime(created_at) DESC
  `);
  return result.rows.map(mapRow);
}

export type ReviewsPage = {
  reviews: ReviewRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  visible: number;
  hidden: number;
};

export async function listReviewsPage(
  page = 1,
  pageSize = 10,
): Promise<ReviewsPage> {
  await ensureSchema();
  const size = Math.min(50, Math.max(1, Math.floor(pageSize)));
  const current = Math.max(1, Math.floor(page));
  const offset = (current - 1) * size;

  const db = getTurso();
  const [counts, result] = await Promise.all([
    db.execute(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS visible
      FROM reviews
    `),
    db.execute({
      sql: `
        SELECT id, quote, name, place, rating, review, photo_url, status, created_at
        FROM reviews
        ORDER BY datetime(created_at) DESC
        LIMIT ? OFFSET ?
      `,
      args: [size, offset],
    }),
  ]);

  const total = Number(counts.rows[0]?.total ?? 0);
  const visible = Number(counts.rows[0]?.visible ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / size));
  const safePage = Math.min(current, totalPages);

  // If the requested page is past the end (e.g. after deletes), refetch the last page.
  let reviews = result.rows.map(mapRow);
  if (safePage !== current && total > 0) {
    const adjusted = await db.execute({
      sql: `
        SELECT id, quote, name, place, rating, review, photo_url, status, created_at
        FROM reviews
        ORDER BY datetime(created_at) DESC
        LIMIT ? OFFSET ?
      `,
      args: [size, (safePage - 1) * size],
    });
    reviews = adjusted.rows.map(mapRow);
  }

  return {
    reviews,
    page: total === 0 ? 1 : safePage,
    pageSize: size,
    total,
    totalPages: total === 0 ? 1 : totalPages,
    visible,
    hidden: Math.max(0, total - visible),
  };
}

export function getReviewsMeta(reviews: ReviewRow[]) {
  if (reviews.length === 0) return { average: 0, count: 0 };
  const average =
    reviews.reduce((sum, row) => sum + clampRating(row.rating), 0) /
    reviews.length;
  return { average, count: reviews.length };
}

export async function createReview(input: ReviewInput): Promise<ReviewRow> {
  await ensureSchema();
  const row: ReviewRow = {
    id: input.id?.trim() || randomUUID(),
    quote: String(input.quote || "").trim().slice(0, 500),
    name: String(input.name || "").trim().slice(0, 80),
    place: String(input.place || "").trim().slice(0, 120),
    rating: clampRating(input.rating),
    review: String(input.review || "").trim().slice(0, 500),
    photo_url: String(input.photo_url || "").trim().slice(0, 500),
    status: normalizeStatus(input.status, 0),
    created_at: new Date().toISOString(),
  };

  await getTurso().execute({
    sql: `INSERT INTO reviews
      (id, quote, name, place, rating, review, photo_url, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      row.id,
      row.quote,
      row.name,
      row.place,
      row.rating,
      row.review,
      row.photo_url,
      statusInt(row.status),
      row.created_at,
    ],
  });

  return row;
}

export async function updateReview(
  id: string,
  patch: Partial<ReviewInput>,
): Promise<ReviewRow | null> {
  await ensureSchema();
  const existingResult = await getTurso().execute({
    sql: `SELECT id, quote, name, place, rating, review, photo_url, status, created_at
          FROM reviews WHERE id = ?`,
    args: [id],
  });
  const existingRow = existingResult.rows[0];
  if (!existingRow) return null;

  const existing = mapRow(existingRow);
  const next: ReviewRow = {
    id: existing.id,
    quote:
      patch.quote != null
        ? String(patch.quote).trim().slice(0, 500)
        : existing.quote,
    name:
      patch.name != null ? String(patch.name).trim().slice(0, 80) : existing.name,
    place:
      patch.place != null
        ? String(patch.place).trim().slice(0, 120)
        : existing.place,
    rating: patch.rating != null ? clampRating(patch.rating) : existing.rating,
    review:
      patch.review != null
        ? String(patch.review).trim().slice(0, 500)
        : existing.review,
    photo_url:
      patch.photo_url != null
        ? String(patch.photo_url).trim().slice(0, 500)
        : existing.photo_url,
    status:
      patch.status != null
        ? normalizeStatus(patch.status, existing.status)
        : existing.status,
    created_at: existing.created_at,
  };

  await getTurso().execute({
    sql: `UPDATE reviews SET
      quote = ?, name = ?, place = ?, rating = ?, review = ?, photo_url = ?, status = ?
     WHERE id = ?`,
    args: [
      next.quote,
      next.name,
      next.place,
      next.rating,
      next.review,
      next.photo_url,
      statusInt(next.status),
      next.id,
    ],
  });

  return next;
}

export async function deleteReview(id: string): Promise<boolean> {
  await ensureSchema();
  const result = await getTurso().execute({
    sql: `DELETE FROM reviews WHERE id = ?`,
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}
