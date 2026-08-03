import type { Metadata } from "next";
import { About } from "@/components/About";
import { Chef } from "@/components/Chef";
import { Experience } from "@/components/Experience";
import { FloatingWidgets } from "@/components/FloatingWidgets";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Testimonials } from "@/components/Testimonials";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute:
      "Private Chef Lombok | In-Villa Chef Service in Kuta & Island-Wide",
  },
  description: site.description,
  alternates: {
    canonical: absoluteUrl(),
  },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <main id="main-content">
        <Experience />
        <About />
        <Chef />
        <Testimonials />
        <Location />
      </main>
      <SiteFooter />
      <FloatingWidgets />
    </>
  );
}
