import type { Metadata } from "next";
import { FloatingWidgets } from "@/components/FloatingWidgets";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { areas, howToBook } from "@/lib/seo-content";
import { getSiteCms } from "@/lib/site-cms";
import { absoluteUrl, whatsappBookingUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const url = absoluteUrl("/how-to-book");
  return {
    title: howToBook.title,
    description: howToBook.description,
    keywords: [
      "hire private chef Lombok",
      "book private chef Lombok",
      "WhatsApp book private chef Lombok",
      "how to hire private chef Lombok",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: howToBook.title,
      description: howToBook.description,
      url,
      type: "website",
    },
  };
}

export default async function HowToBookPage() {
  const content = await getSiteCms();
  const wa = whatsappBookingUrl(undefined, content.whatsappNumber);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howToBook.h1,
    description: howToBook.description,
    step: howToBook.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <SiteHeader siteName={content.name} />
      <main id="main-content">
        <section className="bg-surface-dark text-cream">
          <div className="mx-auto max-w-3xl px-4 pb-16 pt-28 text-center sm:px-10 sm:pb-20 sm:pt-32">
            <p className="font-display text-sm tracking-wide text-candle sm:text-base">
              {content.name}
            </p>
            <h1 className="mt-4 font-display text-3xl leading-tight sm:text-5xl md:text-6xl">
              {howToBook.h1}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/75 sm:text-base md:text-lg">
              {howToBook.lead}
            </p>
          </div>
        </section>

        <section className="section-pad bg-surface-cream">
          <ol className="mx-auto max-w-3xl space-y-10">
            {howToBook.steps.map((step, index) => (
              <Reveal key={step.title} as="li" variant="up" delay={Math.min(index, 3) as 0 | 1 | 2 | 3}>
                <div className="flex gap-5 sm:gap-6">
                  <span className="font-display text-3xl text-candle sm:text-4xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-display text-xl text-ink sm:text-2xl">
                      {step.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75 sm:text-base">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="mt-12 text-center sm:mt-14">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-sm font-medium tracking-wide text-cream transition-colors hover:bg-candle hover:text-ink"
            >
              Message us on WhatsApp
            </a>
          </div>
        </section>

        <section className="section-pad-y bg-surface-white">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-10">
            <h2 className="font-display text-xl text-ink sm:text-2xl">
              Service areas
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {areas.map((area) => (
                <a
                  key={area.slug}
                  href={`/${area.slug}`}
                  className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink transition-colors hover:border-candle hover:text-candle"
                >
                  {area.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter siteName={content.name} />
      <FloatingWidgets whatsappNumber={content.whatsappNumber} />
    </>
  );
}
