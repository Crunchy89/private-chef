import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  contentDefaults,
  getSiteSettings,
  updateSiteContent,
} from "@/lib/admin-db";
import type { SiteContentFields } from "@/lib/site-content";

export const runtime = "nodejs";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  return null;
}

function contentPayload(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  return {
    site_name: settings.site_name,
    hero_title: settings.hero_title,
    hero_subtitle: settings.hero_subtitle,
    about_title_lead: settings.about_title_lead,
    about_title_rest: settings.about_title_rest,
    about_body: settings.about_body,
    chef_title_lead: settings.chef_title_lead,
    chef_title_rest: settings.chef_title_rest,
    chef_body: settings.chef_body,
    reviews_title_lead: settings.reviews_title_lead,
    reviews_title_rest: settings.reviews_title_rest,
    reviews_body: settings.reviews_body,
    location_title_lead: settings.location_title_lead,
    location_title_rest: settings.location_title_rest,
  } satisfies SiteContentFields;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const settings = await getSiteSettings();
  return NextResponse.json({
    ok: true,
    content: contentPayload(settings),
    defaults: contentDefaults(),
  });
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: Partial<SiteContentFields>;
  try {
    body = (await request.json()) as Partial<SiteContentFields>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const settings = await updateSiteContent({
      site_name: body.site_name,
      hero_title: body.hero_title,
      hero_subtitle: body.hero_subtitle,
      about_title_lead: body.about_title_lead,
      about_title_rest: body.about_title_rest,
      about_body: body.about_body,
      chef_title_lead: body.chef_title_lead,
      chef_title_rest: body.chef_title_rest,
      chef_body: body.chef_body,
      reviews_title_lead: body.reviews_title_lead,
      reviews_title_rest: body.reviews_title_rest,
      reviews_body: body.reviews_body,
      location_title_lead: body.location_title_lead,
      location_title_rest: body.location_title_rest,
    });

    revalidatePath("/");
    revalidatePath("/secret/admin/preview");

    return NextResponse.json({
      ok: true,
      content: contentPayload(settings),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Could not save content.",
      },
      { status: 500 },
    );
  }
}
