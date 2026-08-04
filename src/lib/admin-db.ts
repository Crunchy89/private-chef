import "server-only";

import { randomUUID } from "node:crypto";
import { getTurso } from "@/lib/reviews-db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { site } from "@/lib/site";
import type { SiteContentFields } from "@/lib/site-content";

export type { SiteContentFields } from "@/lib/site-content";

export type AdminUser = {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = SiteContentFields & {
  id: string;
  whatsapp_number: string;
  whatsapp_message: string;
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

const CONTENT_COLUMNS: Array<{ name: keyof SiteContentFields; sqlType: string }> = [
  { name: "site_name", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "hero_title", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "hero_subtitle", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "about_title_lead", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "about_title_rest", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "about_body", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "chef_title_lead", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "chef_title_rest", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "chef_body", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "reviews_title_lead", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "reviews_title_rest", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "reviews_body", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "location_title_lead", sqlType: "TEXT NOT NULL DEFAULT ''" },
  { name: "location_title_rest", sqlType: "TEXT NOT NULL DEFAULT ''" },
];

export function contentDefaults(): SiteContentFields {
  return {
    site_name: site.name,
    hero_title: "Hire a private chef for your villa in Kuta Lombok.",
    hero_subtitle:
      "We come to your kitchen, cook a custom menu, and leave the table ready — villa chef service from Kuta to Senggigi, Mandalika, and across Lombok. Book on WhatsApp.",
    about_title_lead: "Dining",
    about_title_rest: "at your villa, not a restaurant",
    about_body:
      "Private Chef Lombok is an in-villa chef service. We shop, cook, and plate in your holiday home so you can host dinner without leaving the property.\n\nIdeal for couples, families, and friend groups who want personal dining with Indonesian flavours, seafood, and flexible menus — whether you are in Kuta Lombok, Senggigi, or Mandalika.",
    chef_title_lead: "What",
    chef_title_rest: "our private chef service includes",
    chef_body:
      "Menu planning, fresh market ingredients, cooking in your kitchen, plating, and clean-up. You enjoy the meal — we handle the work behind it.\n\nShare allergies, spice level, and preferences on WhatsApp. We confirm availability for your Lombok dates and send a clear quote before you hire us.",
    reviews_title_lead: "Guest",
    reviews_title_rest: "reviews from villa dinners in Lombok",
    reviews_body:
      "Honest notes from couples, families, and villa hosts who booked our private chef across Kuta, Senggigi, and the rest of Lombok.",
    location_title_lead: "Service",
    location_title_rest: "area across Lombok",
  };
}

function defaults(): Omit<SiteSettings, "id" | "updated_at"> {
  return {
    whatsapp_number: site.whatsapp.number,
    whatsapp_message: site.whatsapp.defaultMessage,
    location_label: site.location.label,
    location_address: site.location.address,
    location_lat: site.location.lat,
    location_lng: site.location.lng,
    maps_link: site.location.mapsLink,
    ...contentDefaults(),
  };
}

async function ensureWhatsAppMessageColumn() {
  const db = getTurso();
  const info = await db.execute(`PRAGMA table_info(site_settings)`);
  const existing = new Set(info.rows.map((row) => String(row.name)));
  if (!existing.has("whatsapp_message")) {
    await db.execute(
      `ALTER TABLE site_settings ADD COLUMN whatsapp_message TEXT NOT NULL DEFAULT ''`,
    );
  }
  await db.execute({
    sql: `UPDATE site_settings SET whatsapp_message = ?
          WHERE id = 'default' AND (whatsapp_message IS NULL OR whatsapp_message = '')`,
    args: [site.whatsapp.defaultMessage],
  });
}

async function ensureContentColumns() {
  const db = getTurso();
  const info = await db.execute(`PRAGMA table_info(site_settings)`);
  const existing = new Set(info.rows.map((row) => String(row.name)));

  for (const column of CONTENT_COLUMNS) {
    if (existing.has(column.name)) continue;
    await db.execute(
      `ALTER TABLE site_settings ADD COLUMN ${column.name} ${column.sqlType}`,
    );
  }

  // Backfill empty content with defaults once columns exist.
  const d = contentDefaults();
  await db.execute({
    sql: `UPDATE site_settings SET
      site_name = CASE WHEN site_name IS NULL OR site_name = '' THEN ? ELSE site_name END,
      hero_title = CASE WHEN hero_title IS NULL OR hero_title = '' THEN ? ELSE hero_title END,
      hero_subtitle = CASE WHEN hero_subtitle IS NULL OR hero_subtitle = '' THEN ? ELSE hero_subtitle END,
      about_title_lead = CASE WHEN about_title_lead IS NULL OR about_title_lead = '' THEN ? ELSE about_title_lead END,
      about_title_rest = CASE WHEN about_title_rest IS NULL OR about_title_rest = '' THEN ? ELSE about_title_rest END,
      about_body = CASE WHEN about_body IS NULL OR about_body = '' THEN ? ELSE about_body END,
      chef_title_lead = CASE WHEN chef_title_lead IS NULL OR chef_title_lead = '' THEN ? ELSE chef_title_lead END,
      chef_title_rest = CASE WHEN chef_title_rest IS NULL OR chef_title_rest = '' THEN ? ELSE chef_title_rest END,
      chef_body = CASE WHEN chef_body IS NULL OR chef_body = '' THEN ? ELSE chef_body END,
      reviews_title_lead = CASE WHEN reviews_title_lead IS NULL OR reviews_title_lead = '' THEN ? ELSE reviews_title_lead END,
      reviews_title_rest = CASE WHEN reviews_title_rest IS NULL OR reviews_title_rest = '' THEN ? ELSE reviews_title_rest END,
      reviews_body = CASE WHEN reviews_body IS NULL OR reviews_body = '' THEN ? ELSE reviews_body END,
      location_title_lead = CASE WHEN location_title_lead IS NULL OR location_title_lead = '' THEN ? ELSE location_title_lead END,
      location_title_rest = CASE WHEN location_title_rest IS NULL OR location_title_rest = '' THEN ? ELSE location_title_rest END
     WHERE id = 'default'`,
    args: [
      d.site_name,
      d.hero_title,
      d.hero_subtitle,
      d.about_title_lead,
      d.about_title_rest,
      d.about_body,
      d.chef_title_lead,
      d.chef_title_rest,
      d.chef_body,
      d.reviews_title_lead,
      d.reviews_title_rest,
      d.reviews_body,
      d.location_title_lead,
      d.location_title_rest,
    ],
  });

  // One-time SEO copy upgrade when fields still match the previous defaults.
  await db.execute({
    sql: `UPDATE site_settings SET
      hero_title = CASE WHEN hero_title = ? THEN ? ELSE hero_title END,
      hero_subtitle = CASE WHEN hero_subtitle = ? THEN ? ELSE hero_subtitle END,
      about_body = CASE WHEN about_body = ? THEN ? ELSE about_body END,
      chef_body = CASE WHEN chef_body = ? THEN ? ELSE chef_body END
     WHERE id = 'default'`,
    args: [
      "Private chef service for your villa in Lombok.",
      d.hero_title,
      "We come to your kitchen, cook a custom menu, and leave the table ready for you — from Kuta Lombok to Senggigi, Mandalika, and beyond.",
      d.hero_subtitle,
      "Private Chef Lombok is an in-villa chef service. We shop, cook, and plate in your holiday home so you can host dinner without leaving the property.\n\nIdeal for couples, families, and friend groups who want a personal dining experience with Indonesian flavours, seafood, and flexible menus built around your guests.",
      d.about_body,
      "Menu planning, fresh market ingredients, cooking in your kitchen, plating, and clean-up. You enjoy the meal — we handle the work behind it.\n\nShare allergies, spice level, and preferences on WhatsApp. We confirm availability for your Lombok dates and send a clear quote before you book.",
      d.chef_body,
    ],
  });
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

      await ensureContentColumns();
      await ensureWhatsAppMessageColumn();

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
            (id, whatsapp_number, location_label, location_address, location_lat, location_lng, maps_link,
             site_name, hero_title, hero_subtitle,
             about_title_lead, about_title_rest, about_body,
             chef_title_lead, chef_title_rest, chef_body,
             reviews_title_lead, reviews_title_rest, reviews_body,
             location_title_lead, location_title_rest, updated_at)
           VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            d.whatsapp_number,
            d.location_label,
            d.location_address,
            d.location_lat,
            d.location_lng,
            d.maps_link,
            d.site_name,
            d.hero_title,
            d.hero_subtitle,
            d.about_title_lead,
            d.about_title_rest,
            d.about_body,
            d.chef_title_lead,
            d.chef_title_rest,
            d.chef_body,
            d.reviews_title_lead,
            d.reviews_title_rest,
            d.reviews_body,
            d.location_title_lead,
            d.location_title_rest,
            now,
          ],
        });
      }
    })();
  }
  await globalForAdmin.__privateChefAdminReady;
  // Always migrate columns (covers hot-reload / older DBs).
  await ensureContentColumns();
  await ensureWhatsAppMessageColumn();
}

function pickText(
  row: Record<string, unknown>,
  key: keyof SiteContentFields,
  fallback: string,
) {
  const value = String(row[key] ?? "").trim();
  return value || fallback;
}

function mapSettings(row: Record<string, unknown>): SiteSettings {
  const d = defaults();
  return {
    id: String(row.id ?? "default"),
    whatsapp_number: String(row.whatsapp_number ?? d.whatsapp_number),
    whatsapp_message:
      String(row.whatsapp_message ?? "").trim() || d.whatsapp_message,
    location_label: String(row.location_label ?? d.location_label),
    location_address: String(row.location_address ?? d.location_address),
    location_lat: Number(row.location_lat ?? d.location_lat),
    location_lng: Number(row.location_lng ?? d.location_lng),
    maps_link: String(row.maps_link ?? d.maps_link),
    site_name: pickText(row, "site_name", d.site_name),
    hero_title: pickText(row, "hero_title", d.hero_title),
    hero_subtitle: pickText(row, "hero_subtitle", d.hero_subtitle),
    about_title_lead: pickText(row, "about_title_lead", d.about_title_lead),
    about_title_rest: pickText(row, "about_title_rest", d.about_title_rest),
    about_body: pickText(row, "about_body", d.about_body),
    chef_title_lead: pickText(row, "chef_title_lead", d.chef_title_lead),
    chef_title_rest: pickText(row, "chef_title_rest", d.chef_title_rest),
    chef_body: pickText(row, "chef_body", d.chef_body),
    reviews_title_lead: pickText(row, "reviews_title_lead", d.reviews_title_lead),
    reviews_title_rest: pickText(row, "reviews_title_rest", d.reviews_title_rest),
    reviews_body: pickText(row, "reviews_body", d.reviews_body),
    location_title_lead: pickText(
      row,
      "location_title_lead",
      d.location_title_lead,
    ),
    location_title_rest: pickText(
      row,
      "location_title_rest",
      d.location_title_rest,
    ),
    updated_at: String(row.updated_at ?? ""),
  };
}

const SETTINGS_SELECT = `SELECT id, whatsapp_number, whatsapp_message, location_label, location_address, location_lat, location_lng, maps_link,
  site_name, hero_title, hero_subtitle,
  about_title_lead, about_title_rest, about_body,
  chef_title_lead, chef_title_rest, chef_body,
  reviews_title_lead, reviews_title_rest, reviews_body,
  location_title_lead, location_title_rest, updated_at
 FROM site_settings WHERE id = 'default' LIMIT 1`;

export async function getSiteSettings(): Promise<SiteSettings> {
  await ensureAdminSchema();
  const result = await getTurso().execute(SETTINGS_SELECT);
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

function cleanText(value: string, max: number) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

export async function updateSiteSettings(
  patch: Partial<{
    whatsapp_number: string;
    whatsapp_message: string;
    location_label: string;
    location_address: string;
    location_lat: number;
    location_lng: number;
    maps_link: string;
  } & SiteContentFields>,
): Promise<SiteSettings> {
  await ensureAdminSchema();
  const current = await getSiteSettings();
  const next: SiteSettings = {
    ...current,
    whatsapp_number:
      patch.whatsapp_number != null
        ? cleanWhatsApp(patch.whatsapp_number)
        : current.whatsapp_number,
    whatsapp_message:
      patch.whatsapp_message != null
        ? cleanText(patch.whatsapp_message, 1000)
        : current.whatsapp_message,
    location_label:
      patch.location_label != null
        ? cleanText(patch.location_label, 200)
        : current.location_label,
    location_address:
      patch.location_address != null
        ? cleanText(patch.location_address, 300)
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
        ? cleanText(patch.maps_link, 500)
        : current.maps_link,
    site_name:
      patch.site_name != null
        ? cleanText(patch.site_name, 120)
        : current.site_name,
    hero_title:
      patch.hero_title != null
        ? cleanText(patch.hero_title, 200)
        : current.hero_title,
    hero_subtitle:
      patch.hero_subtitle != null
        ? cleanText(patch.hero_subtitle, 500)
        : current.hero_subtitle,
    about_title_lead:
      patch.about_title_lead != null
        ? cleanText(patch.about_title_lead, 80)
        : current.about_title_lead,
    about_title_rest:
      patch.about_title_rest != null
        ? cleanText(patch.about_title_rest, 160)
        : current.about_title_rest,
    about_body:
      patch.about_body != null
        ? cleanText(patch.about_body, 2000)
        : current.about_body,
    chef_title_lead:
      patch.chef_title_lead != null
        ? cleanText(patch.chef_title_lead, 80)
        : current.chef_title_lead,
    chef_title_rest:
      patch.chef_title_rest != null
        ? cleanText(patch.chef_title_rest, 160)
        : current.chef_title_rest,
    chef_body:
      patch.chef_body != null
        ? cleanText(patch.chef_body, 2000)
        : current.chef_body,
    reviews_title_lead:
      patch.reviews_title_lead != null
        ? cleanText(patch.reviews_title_lead, 80)
        : current.reviews_title_lead,
    reviews_title_rest:
      patch.reviews_title_rest != null
        ? cleanText(patch.reviews_title_rest, 160)
        : current.reviews_title_rest,
    reviews_body:
      patch.reviews_body != null
        ? cleanText(patch.reviews_body, 1000)
        : current.reviews_body,
    location_title_lead:
      patch.location_title_lead != null
        ? cleanText(patch.location_title_lead, 80)
        : current.location_title_lead,
    location_title_rest:
      patch.location_title_rest != null
        ? cleanText(patch.location_title_rest, 160)
        : current.location_title_rest,
    updated_at: new Date().toISOString(),
  };

  await getTurso().execute({
    sql: `UPDATE site_settings SET
      whatsapp_number = ?, whatsapp_message = ?, location_label = ?, location_address = ?,
      location_lat = ?, location_lng = ?, maps_link = ?,
      site_name = ?, hero_title = ?, hero_subtitle = ?,
      about_title_lead = ?, about_title_rest = ?, about_body = ?,
      chef_title_lead = ?, chef_title_rest = ?, chef_body = ?,
      reviews_title_lead = ?, reviews_title_rest = ?, reviews_body = ?,
      location_title_lead = ?, location_title_rest = ?, updated_at = ?
     WHERE id = 'default'`,
    args: [
      next.whatsapp_number,
      next.whatsapp_message,
      next.location_label,
      next.location_address,
      next.location_lat,
      next.location_lng,
      next.maps_link,
      next.site_name,
      next.hero_title,
      next.hero_subtitle,
      next.about_title_lead,
      next.about_title_rest,
      next.about_body,
      next.chef_title_lead,
      next.chef_title_rest,
      next.chef_body,
      next.reviews_title_lead,
      next.reviews_title_rest,
      next.reviews_body,
      next.location_title_lead,
      next.location_title_rest,
      next.updated_at,
    ],
  });

  return next;
}

export async function updateSiteContent(
  patch: Partial<SiteContentFields>,
): Promise<SiteSettings> {
  return updateSiteSettings(patch);
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
