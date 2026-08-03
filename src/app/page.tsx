import { About } from "@/components/About";
import { Chef } from "@/components/Chef";
import { Experience } from "@/components/Experience";
import { FloatingWidgets } from "@/components/FloatingWidgets";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <main>
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
