import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "pcl_admin_session";

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || "pcl-admin-session-dev";
}

async function hmacSign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function verifyToken(token: string | undefined) {
  const secret = sessionSecret();
  if (!token || !secret) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return false;
  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  const expected = await hmacSign(payload, secret);
  if (!timingSafeEqualString(signature, expected)) return false;
  const exp = Number(payload.split(":")[1]);
  return Number.isFinite(exp) && Date.now() <= exp;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/secret/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/secret/admin/login") {
    const ok = await verifyToken(request.cookies.get(ADMIN_COOKIE)?.value);
    if (ok) {
      return NextResponse.redirect(new URL("/secret/admin", request.url));
    }
    return NextResponse.next();
  }

  const ok = await verifyToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!ok) {
    const login = new URL("/secret/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/secret/admin", "/secret/admin/:path*"],
};
