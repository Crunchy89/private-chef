/**
 * Seed admin user + site settings in Turso.
 * Usage: yarn seed:admin
 *        yarn seed:admin --reset   (recreate admin/admin + refresh defaults)
 *
 * Turso credentials come from src/config.ts
 */
import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import { createClient } from "@libsql/client";
import { loadTursoFromConfig } from "./load-turso-config.mjs";

const { databaseUrl: url, authToken } = loadTursoFromConfig();


function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

const db = createClient({ url, authToken });
const reset = process.argv.includes("--reset");

await db.batch(
  [
    `CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY NOT NULL,
      whatsapp_number TEXT NOT NULL,
      location_label TEXT NOT NULL,
      location_address TEXT NOT NULL,
      location_lat REAL NOT NULL,
      location_lng REAL NOT NULL,
      maps_link TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
  ],
  "write",
);

const now = new Date().toISOString();
const passwordHash = hashPassword("admin");

if (reset) {
  await db.execute(`DELETE FROM admin_users`);
  await db.execute(`DELETE FROM site_settings WHERE id = 'default'`);
  console.log("Cleared admin users and default site settings.");
}

const users = await db.execute(`SELECT COUNT(*) AS n FROM admin_users`);
if (Number(users.rows[0]?.n ?? 0) === 0) {
  await db.execute({
    sql: `INSERT INTO admin_users (id, username, password_hash, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?)`,
    args: [randomUUID(), "admin", passwordHash, now, now],
  });
  console.log("✓ Seeded admin user (username: admin, password: admin, hashed)");
} else if (reset) {
  // unreachable due to delete above, kept for clarity
} else {
  console.log("Admin user already exists — skipped (use --reset to recreate).");
}

const settings = await db.execute(
  `SELECT COUNT(*) AS n FROM site_settings WHERE id = 'default'`,
);
if (Number(settings.rows[0]?.n ?? 0) === 0) {
  await db.execute({
    sql: `INSERT INTO site_settings
      (id, whatsapp_number, location_label, location_address, location_lat, location_lng, maps_link, updated_at)
     VALUES ('default', ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "6287858018811",
      "Based in Kuta Lombok — we cook island-wide",
      "Kuta, Central Lombok, West Nusa Tenggara, Indonesia",
      -8.8956,
      116.2775,
      "https://maps.google.com/?q=Kuta,+Lombok,+Indonesia",
      now,
    ],
  });
  console.log("✓ Seeded site settings (WhatsApp + Google location)");
} else {
  console.log("Site settings already exist — skipped.");
}

const admin = await db.execute(
  `SELECT username, substr(password_hash, 1, 20) AS hash_prefix FROM admin_users LIMIT 1`,
);
console.log("Admin:", admin.rows[0]);
console.log("Done.");
