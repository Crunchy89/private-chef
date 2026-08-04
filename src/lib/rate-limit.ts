import "server-only";

import { getTurso } from "@/lib/reviews-db";

const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 5;

const globalForRateLimit = globalThis as unknown as {
  __privateChefRateLimitReady?: Promise<void>;
};

async function ensureRateLimitSchema() {
  if (!globalForRateLimit.__privateChefRateLimitReady) {
    globalForRateLimit.__privateChefRateLimitReady = (async () => {
      const db = getTurso();
      await db.execute(`
        CREATE TABLE IF NOT EXISTS review_rate_limits (
          key TEXT PRIMARY KEY NOT NULL,
          window_started_at TEXT NOT NULL,
          hit_count INTEGER NOT NULL DEFAULT 0
        )
      `);

      // Migrate older schema that only had last_at.
      const info = await db.execute(`PRAGMA table_info(review_rate_limits)`);
      const cols = new Set(info.rows.map((row) => String(row.name)));
      if (!cols.has("window_started_at")) {
        await db.execute(
          `ALTER TABLE review_rate_limits ADD COLUMN window_started_at TEXT NOT NULL DEFAULT ''`,
        );
      }
      if (!cols.has("hit_count")) {
        await db.execute(
          `ALTER TABLE review_rate_limits ADD COLUMN hit_count INTEGER NOT NULL DEFAULT 0`,
        );
      }
      if (cols.has("last_at")) {
        await db.execute(`
          UPDATE review_rate_limits
          SET window_started_at = last_at
          WHERE window_started_at = '' OR window_started_at IS NULL
        `);
      }
    })();
  }
  await globalForRateLimit.__privateChefRateLimitReady;
}

/** Best-effort client IP from common proxy headers. */
export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 80);
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 80);

  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp.slice(0, 80);

  return "unknown";
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSec: number };

/**
 * Allow 5 public review submits per key (usually IP) every 5 minutes.
 * Stored in Turso so it holds across serverless instances.
 */
export async function consumeReviewSubmitSlot(
  key: string,
): Promise<RateLimitResult> {
  await ensureRateLimitSchema();
  const db = getTurso();
  const now = Date.now();
  const rateKey = `review:${key || "unknown"}`;
  const nowIso = new Date(now).toISOString();

  const existing = await db.execute({
    sql: `SELECT window_started_at, hit_count FROM review_rate_limits WHERE key = ? LIMIT 1`,
    args: [rateKey],
  });

  const row = existing.rows[0];
  if (row) {
    const windowStart = Date.parse(String(row.window_started_at ?? ""));
    const hitCount = Number(row.hit_count ?? 0);
    const windowOpen =
      Number.isFinite(windowStart) && now - windowStart < WINDOW_MS;

    if (windowOpen) {
      if (hitCount >= MAX_REQUESTS) {
        return {
          allowed: false,
          retryAfterSec: Math.max(
            1,
            Math.ceil((WINDOW_MS - (now - windowStart)) / 1000),
          ),
        };
      }

      await db.execute({
        sql: `UPDATE review_rate_limits SET hit_count = hit_count + 1 WHERE key = ?`,
        args: [rateKey],
      });
      return { allowed: true };
    }
  }

  await db.execute({
    sql: `INSERT INTO review_rate_limits (key, window_started_at, hit_count)
          VALUES (?, ?, 1)
          ON CONFLICT(key) DO UPDATE SET
            window_started_at = excluded.window_started_at,
            hit_count = 1`,
    args: [rateKey, nowIso],
  });

  return { allowed: true };
}
