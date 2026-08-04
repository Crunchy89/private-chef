import "server-only";

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

/** Store as `scrypt$<salt>$<hash>` — never store plain passwords. */
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [algo, salt, hash] = String(stored).split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const next = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== next.length) return false;
  return timingSafeEqual(expected, next);
}
