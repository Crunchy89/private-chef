import "server-only";

import { randomUUID } from "node:crypto";
import { getTurso } from "@/lib/reviews-db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { site } from "@/lib/site";

export type AdminUser = {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: string;
  whatsapp_number: string;
  location_label: string;
  location_address: string;
  location_lat: number;
  location_lng: number;
  maps_link: string;
  updated_at: string;
};

const globalForAdmin = globalThis as unknown as {
  __privateChefAdminReady?: Promise<void>;
};

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin";

function defaults(): Omit<SiteSettings, "id" | "updated_at"> {
  return {
    whatsapp_number: site.whatsapp.number,
    location_label: site.location.label,
    location_address: site.location.address,
    location_lat: site.location.lat,
    location_lng: site.location.lng,
    maps_link: site.location.mapsLink,
  };
}

export async function ensureAdminSchema() {
  if (!globalForAdmin.__privateChefAdminReady) {
    globalForAdmin.__privateChefAdminReady = (async () => {
      const db = getTurso();
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

      const users = await db.execute(`SELECT COUNT(*) AS n FROM admin_users`);
      if (Number(users.rows[0]?.n ?? 0) === 0) {
        const now = new Date().toISOString();
        await db.execute({
          sql: `INSERT INTO admin_users (id, username, password_hash, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)`,
          args: [
            randomUUID(),
            DEFAULT_ADMIN_USERNAME,
            hashPassword(DEFAULT_ADMIN_PASSWORD),
            now,
            now,
          ],
        });
      }

      const settings = await db.execute(
        `SELECT COUNT(*) AS n FROM site_settings WHERE id = 'default'`,
      );
      if (Number(settings.rows[0]?.n ?? 0) === 0) {
        const now = new Date().toISOString();
        const d = defaults();
        await db.execute({
          sql: `INSERT INTO site_settings
            (id, whatsapp_number, location_label, location_address, location_lat, location_lng, maps_link, updated_at)
           VALUES ('default', ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            d.whatsapp_number,
            d.location_label,
            d.location_address,
            d.location_lat,
            d.location_lng,
            d.maps_link,
            now,
          ],
        });
      }
    })();
  }
  await globalForAdmin.__privateChefAdminReady;
}

function mapSettings(row: Record<string, unknown>): SiteSettings {
  const d = defaults();
  return {
    id: String(row.id ?? "default"),
    whatsapp_number: String(row.whatsapp_number ?? d.whatsapp_number),
    location_label: String(row.location_label ?? d.location_label),
    location_address: String(row.location_address ?? d.location_address),
    location_lat: Number(row.location_lat ?? d.location_lat),
    location_lng: Number(row.location_lng ?? d.location_lng),
    maps_link: String(row.maps_link ?? d.maps_link),
    updated_at: String(row.updated_at ?? ""),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await ensureAdminSchema();
  const result = await getTurso().execute(
    `SELECT id, whatsapp_number, location_label, location_address, location_lat, location_lng, maps_link, updated_at
     FROM site_settings WHERE id = 'default' LIMIT 1`,
  );
  const row = result.rows[0];
  if (!row) {
    const d = defaults();
    return {
      id: "default",
      ...d,
      updated_at: new Date().toISOString(),
    };
  }
  return mapSettings(row as Record<string, unknown>);
}

export async function updateSiteSettings(
  patch: Partial<{
    whatsapp_number: string;
    location_label: string;
    location_address: string;
    location_lat: number;
    location_lng: number;
    maps_link: string;
  }>,
): Promise<SiteSettings> {
  await ensureAdminSchema();
  const current = await getSiteSettings();
  const next: SiteSettings = {
    ...current,
    whatsapp_number:
      patch.whatsapp_number != null
        ? cleanWhatsApp(patch.whatsapp_number)
        : current.whatsapp_number,
    location_label:
      patch.location_label != null
        ? String(patch.location_label).trim().slice(0, 200)
        : current.location_label,
    location_address:
      patch.location_address != null
        ? String(patch.location_address).trim().slice(0, 300)
        : current.location_address,
    location_lat:
      patch.location_lat != null && Number.isFinite(patch.location_lat)
        ? patch.location_lat
        : current.location_lat,
    location_lng:
      patch.location_lng != null && Number.isFinite(patch.location_lng)
        ? patch.location_lng
        : current.location_lng,
    maps_link:
      patch.maps_link != null
        ? String(patch.maps_link).trim().slice(0, 500)
        : current.maps_link,
    updated_at: new Date().toISOString(),
  };

  await getTurso().execute({
    sql: `UPDATE site_settings SET
      whatsapp_number = ?, location_label = ?, location_address = ?,
      location_lat = ?, location_lng = ?, maps_link = ?, updated_at = ?
     WHERE id = 'default'`,
    args: [
      next.whatsapp_number,
      next.location_label,
      next.location_address,
      next.location_lat,
      next.location_lng,
      next.maps_link,
      next.updated_at,
    ],
  });

  return next;
}

function cleanWhatsApp(value: string) {
  return String(value)
    .replace(/[^\d]/g, "")
    .slice(0, 20);
}

export async function getAdminUserByUsername(username: string) {
  await ensureAdminSchema();
  const result = await getTurso().execute({
    sql: `SELECT id, username, password_hash, created_at, updated_at
          FROM admin_users WHERE lower(username) = lower(?) LIMIT 1`,
    args: [username.trim()],
  });
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: String(row.id),
    username: String(row.username),
    password_hash: String(row.password_hash),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  } satisfies AdminUser;
}

export async function getPrimaryAdminUser() {
  await ensureAdminSchema();
  const result = await getTurso().execute(
    `SELECT id, username, password_hash, created_at, updated_at
     FROM admin_users ORDER BY created_at ASC LIMIT 1`,
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: String(row.id),
    username: String(row.username),
    password_hash: String(row.password_hash),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  } satisfies AdminUser;
}

export async function verifyAdminCredentials(
  username: string,
  password: string,
) {
  const user = await getAdminUserByUsername(username);
  if (!user) return null;
  if (!verifyPassword(password, user.password_hash)) return null;
  return user;
}

export async function updateAdminCredentials(input: {
  username?: string;
  password?: string;
}) {
  await ensureAdminSchema();
  const user = await getPrimaryAdminUser();
  if (!user) throw new Error("Admin user not found.");

  const username =
    input.username != null
      ? String(input.username).trim().slice(0, 64)
      : user.username;
  if (!username) throw new Error("Username is required.");

  if (username.toLowerCase() !== user.username.toLowerCase()) {
    const clash = await getAdminUserByUsername(username);
    if (clash && clash.id !== user.id) {
      throw new Error("That username is already taken.");
    }
  }

  const password_hash =
    input.password && input.password.length > 0
      ? hashPassword(input.password)
      : user.password_hash;

  const updated_at = new Date().toISOString();
  await getTurso().execute({
    sql: `UPDATE admin_users SET username = ?, password_hash = ?, updated_at = ? WHERE id = ?`,
    args: [username, password_hash, updated_at, user.id],
  });

  return { id: user.id, username, updated_at };
}
