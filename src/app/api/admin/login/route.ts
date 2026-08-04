import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  authenticateAdmin,
  createAdminSessionToken,
  isAdminConfigured,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Admin login is not configured.",
      },
      { status: 503 },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  if (!username || !password) {
    return NextResponse.json(
      { ok: false, error: "Username and password are required." },
      { status: 400 },
    );
  }

  try {
    const user = await authenticateAdmin(username, password);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Incorrect username or password." },
        { status: 401 },
      );
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ ok: true, username: user.username });
    response.cookies.set(
      ADMIN_COOKIE,
      token,
      adminCookieOptions(7 * 24 * 60 * 60),
    );
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Could not sign in.",
      },
      { status: 500 },
    );
  }
}
