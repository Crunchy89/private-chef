import type { Metadata } from "next";
import { About } from "@/components/About";
import { Chef } from "@/components/Chef";
import { Experience } from "@/components/Experience";
import { FloatingWidgets } from "@/components/FloatingWidgets";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { ReviewForm } from "@/components/ReviewForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reviews } from "@/components/Reviews";
import { getSiteCms } from "@/lib/site-cms";
import { absoluteUrl, site } from "@/lib/site";

/** Always refetch CMS (reviews/settings) on each request */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteCms();
  return {
    title: {
      absolute:
        "Private Chef Lombok | Hire In-Villa Chef in Kuta & Island-Wide",
    },
    description: content.description,
    keywords: [...site.keywords],
    alternates: {
      canonical: absoluteUrl(),
      languages: {
        en: absoluteUrl(),
        "x-default": absoluteUrl(),
      },
    },
  };
}

export default async function Home() {
  const content = await getSiteCms();

  return (
    <>
      <SiteHeader siteName={content.name} />
      <Hero />
      <main id="main-content">
        <Experience
          whatsappNumber={content.whatsappNumber}
          whatsappMessage={content.whatsappMessage}
          mapsLink={content.location.mapsLink}
        />
        <About />
        <Chef />
        <Reviews />
        <ReviewForm />
        <Location />
      </main>
      <SiteFooter siteName={content.name} />
      <FloatingWidgets
        whatsappNumber={content.whatsappNumber}
        whatsappMessage={content.whatsappMessage}
      />
    </>
  );
}
