import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { ensureAdminSchema, verifyAdminCredentials } from "@/lib/admin-db";

export const ADMIN_COOKIE = "pcl_admin_session";
const SESSION_DAYS = 7;

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || "pcl-admin-session-dev";
}

export function isAdminConfigured() {
  return Boolean(sessionSecret());
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function createAdminSessionToken(now = Date.now()) {
  const exp = now + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `admin:${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token || !sessionSecret()) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return false;
  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  const expected = sign(payload);
  if (!safeEqual(signature, expected)) return false;

  const [, expRaw] = payload.split(":");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return true;
}

export async function authenticateAdmin(username: string, password: string) {
  await ensureAdminSchema();
  return verifyAdminCredentials(username, password);
}

export async function isAdminAuthenticated() {
  if (!isAdminConfigured()) return false;
  const jar = await cookies();
  return verifyAdminSessionToken(jar.get(ADMIN_COOKIE)?.value);
}

export function adminCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
