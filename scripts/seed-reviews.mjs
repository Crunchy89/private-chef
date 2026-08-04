/**
 * Seed Turso reviews DB.
 * Usage: yarn seed:reviews
 *        yarn seed:reviews --reset
 *
 * Turso credentials come from src/config.ts
 */
import { randomUUID } from "node:crypto";
import { createClient } from "@libsql/client";
import { loadTursoFromConfig } from "./load-turso-config.mjs";

const { databaseUrl: url, authToken } = loadTursoFromConfig();


const seeds = [
  {
    quote:
      "We booked Private Chef Lombok for our Senggigi villa. The chef handled everything — shopping, cooking, and clean-up. Best dinner of the trip.",
    name: "Hannah & Mark",
    place: "Villa dinner, Senggigi",
    rating: 5,
    review: "Professional private chef service from start to finish.",
    status: 1,
  },
  {
    quote:
      "Six of us near Kuta Lombok. Fresh seafood, clear pricing on WhatsApp, and no restaurant transfers. Exactly what we needed.",
    name: "Priya R.",
    place: "Group booking, South Lombok",
    rating: 5,
    review: "Menus adapted perfectly to our dietary needs.",
    status: 1,
  },
  {
    quote:
      "We recommend this private chef service to every guest at our villa. Easy to book and consistently excellent.",
    name: "Villa Amara",
    place: "Villa host, Lombok",
    rating: 5,
    review: "Our guests keep asking for the WhatsApp number.",
    status: 1,
  },
  {
    quote:
      "Anniversary dinner on the terrace with a private chef. Quiet, generous portions, and dessert we still talk about.",
    name: "Tomás L.",
    place: "Couple dinner, Mangsit",
    rating: 5,
    review: "Felt like fine dining without leaving the villa.",
    status: 1,
  },
  {
    quote:
      "Family of eight including kids. Patient cooking, flexible menu, and great local flavours. Highly recommend for Lombok stays.",
    name: "The Chen family",
    place: "Family villa, Bangsal",
    rating: 4,
    review: "Easy WhatsApp booking and fair value.",
    status: 1,
  },
  {
    quote:
      "Booked again for friends arriving the next week. Same private chef service, same standard — arranged in two messages.",
    name: "Sofia & Luca",
    place: "Repeat booking, Kuta Lombok",
    rating: 5,
    review: "Reliable enough that we already rebooked.",
    status: 1,
  },
];

const db = createClient({ url, authToken });

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

// Fix legacy text/float status values and rebuild column as INTEGER if needed.
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
  console.log("Migrated status column to INTEGER.");
} else {
  // Even with INTEGER affinity, rewrite values as true integers (bigint bind).
  const rows = await db.execute(`SELECT id, status FROM reviews`);
  for (const row of rows.rows) {
    const n = Number(row.status);
    const next = Number.isFinite(n) && n >= 0.5 ? 1n : 0n;
    await db.execute({
      sql: `UPDATE reviews SET status = ? WHERE id = ?`,
      args: [next, String(row.id)],
    });
  }
  console.log("Normalized status values to integers 0/1.");
}

if (process.argv.includes("--reset")) {
  await db.execute("DELETE FROM reviews");
  console.log("Cleared existing reviews.");
}

for (const seed of seeds) {
  const id = randomUUID();
  await db.execute({
    sql: `INSERT INTO reviews
      (id, quote, name, place, rating, review, photo_url, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      seed.quote,
      seed.name,
      seed.place,
      seed.rating,
      seed.review,
      "",
      BigInt(seed.status),
      new Date().toISOString(),
    ],
  });
  console.log("✓", seed.name);
}

const count = await db.execute("SELECT COUNT(*) AS n FROM reviews");
console.log(`Done. ${count.rows[0]?.n ?? "?"} reviews in Turso`);
