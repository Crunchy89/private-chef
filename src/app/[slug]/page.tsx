import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AreaLanding } from "@/components/AreaLanding";
import { areas, getAreaBySlug } from "@/lib/seo-content";
import { getSiteCms } from "@/lib/site-cms";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return areas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) return {};

  const url = absoluteUrl(`/${area.slug}`);
  return {
    title: area.title,
    description: area.description,
    keywords: [...area.keywords],
    alternates: { canonical: url },
    openGraph: {
      title: area.title,
      description: area.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: area.title,
      description: area.description,
    },
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();

  const content = await getSiteCms();

  return (
    <AreaLanding
      area={area}
      siteName={content.name}
      whatsappNumber={content.whatsappNumber}
      whatsappMessage={content.whatsappMessage}
    />
  );
}
