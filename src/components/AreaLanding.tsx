import { FloatingWidgets } from "@/components/FloatingWidgets";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import { areas, type AreaPage } from "@/lib/seo-content";
import { whatsappBookingUrl } from "@/lib/site";

type AreaLandingProps = {
  area: AreaPage;
  siteName: string;
  whatsappNumber: string;
};

export function AreaLanding({
  area,
  siteName,
  whatsappNumber,
}: AreaLandingProps) {
  const wa = whatsappBookingUrl(
    `Hi! I'd like to book a private chef for a villa in ${area.name}. Here are my dates, guest count, and location:`,
    whatsappNumber,
  );
  const others = areas.filter((item) => item.slug !== area.slug);

  return (
    <>
      <SiteHeader siteName={siteName} />
      <main id="main-content">
        <section className="bg-surface-dark text-cream">
          <div className="mx-auto max-w-3xl px-4 pb-16 pt-28 text-center sm:px-10 sm:pb-20 sm:pt-32 lg:px-16">
            <p className="font-display text-sm tracking-wide text-candle sm:text-base">
              {siteName} · {area.shortName}
            </p>
            <h1 className="mt-4 font-display text-3xl leading-tight tracking-tight sm:text-5xl md:text-6xl">
              {area.h1}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/75 sm:mt-6 sm:text-base md:text-lg">
              {area.lead}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-candle px-6 py-3 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-cream"
              >
                Book on WhatsApp
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-cream/25 px-6 py-3 text-sm tracking-wide text-cream transition-colors hover:border-candle hover:text-candle"
              >
                Back to home
              </a>
            </div>
          </div>
        </section>

        <section className="section-pad bg-surface-cream">
          <div className="mx-auto max-w-3xl">
            {area.body.map((para, index) => (
              <Reveal key={index} variant="up" delay={Math.min(index, 2) as 0 | 1 | 2}>
                <p
                  className={`text-sm leading-relaxed text-ink/80 sm:text-base md:text-lg ${
                    index > 0 ? "mt-4 sm:mt-5" : ""
                  }`}
                >
                  {para}
                </p>
              </Reveal>
            ))}

            <Reveal delay={2} variant="up" className="mt-10 sm:mt-12">
              <ul className="space-y-3 border-t border-ink/10 pt-8">
                {area.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-ink sm:text-base"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-candle" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={3} variant="up" className="mt-10 text-center sm:mt-12">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 text-sm font-medium tracking-wide text-cream transition-colors hover:bg-candle hover:text-ink"
              >
                Hire a private chef in {area.shortName}
              </a>
            </Reveal>
          </div>
        </section>

        <section className="section-pad-y bg-surface-white">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-10">
            <h2 className="font-display text-xl text-ink sm:text-2xl">
              Also cooking across Lombok
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {others.map((item) => (
                <a
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink transition-colors hover:border-candle hover:text-candle"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="/how-to-book"
                className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink transition-colors hover:border-candle hover:text-candle"
              >
                How to book
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter siteName={siteName} />
      <FloatingWidgets whatsappNumber={whatsappNumber} />
    </>
  );
}
