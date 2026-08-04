import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";
import { getSiteSettings } from "@/lib/admin-db";
import { PreviewContentForm } from "./preview-form";

export const metadata: Metadata = {
  title: "Preview Site",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PreviewSitePage() {
  const settings = await getSiteSettings();

  const content = {
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
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Preview Site"
        description="Edit header and homepage text. Changes appear on the live site after save."
        action={
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
          >
            Open live site
          </Link>
        }
      />

      <PreviewContentForm initial={content} />

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <p className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
            Live preview
          </p>
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-theme-sm text-brand-500 hover:text-brand-600"
          >
            Open in new tab
          </Link>
        </div>
        <iframe
          title="Site preview"
          src="/"
          className="h-[70vh] w-full bg-white"
        />
      </section>
    </div>
  );
}
