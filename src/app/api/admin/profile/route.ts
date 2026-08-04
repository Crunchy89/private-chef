import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getPrimaryAdminUser,
  getSiteSettings,
  updateAdminCredentials,
  updateSiteSettings,
} from "@/lib/admin-db";

export const runtime = "nodejs";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [admin, settings] = await Promise.all([
    getPrimaryAdminUser(),
    getSiteSettings(),
  ]);

  return NextResponse.json({
    ok: true,
    username: admin?.username ?? "admin",
    settings: {
      whatsapp_number: settings.whatsapp_number,
      whatsapp_message: settings.whatsapp_message,
      location_label: settings.location_label,
      location_address: settings.location_address,
      location_lat: settings.location_lat,
      location_lng: settings.location_lng,
      maps_link: settings.maps_link,
    },
  });
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: {
    username?: string;
    password?: string;
    whatsapp_number?: string;
    whatsapp_message?: string;
    location_label?: string;
    location_address?: string;
    location_lat?: number | string;
    location_lng?: number | string;
    maps_link?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  try {
    if (body.username != null || (body.password != null && body.password !== "")) {
      await updateAdminCredentials({
        username: body.username,
        password: body.password,
      });
    }

    const lat =
      body.location_lat != null && body.location_lat !== ""
        ? Number(body.location_lat)
        : undefined;
    const lng =
      body.location_lng != null && body.location_lng !== ""
        ? Number(body.location_lng)
        : undefined;

    if (
      body.whatsapp_number != null ||
      body.whatsapp_message != null ||
      body.location_label != null ||
      body.location_address != null ||
      lat != null ||
      lng != null ||
      body.maps_link != null
    ) {
      await updateSiteSettings({
        whatsapp_number: body.whatsapp_number,
        whatsapp_message: body.whatsapp_message,
        location_label: body.location_label,
        location_address: body.location_address,
        location_lat: lat,
        location_lng: lng,
        maps_link: body.maps_link,
      });
    }

    revalidatePath("/");
    revalidatePath("/secret/admin/profile");

    const [admin, settings] = await Promise.all([
      getPrimaryAdminUser(),
      getSiteSettings(),
    ]);

    return NextResponse.json({
      ok: true,
      username: admin?.username ?? "admin",
      settings: {
        whatsapp_number: settings.whatsapp_number,
        whatsapp_message: settings.whatsapp_message,
        location_label: settings.location_label,
        location_address: settings.location_address,
        location_lat: settings.location_lat,
        location_lng: settings.location_lng,
        maps_link: settings.maps_link,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not save profile.",
      },
      { status: 500 },
    );
  }
}
