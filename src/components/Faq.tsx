import { Reveal } from "@/components/Reveal";
import { homeFaqs, type FaqItem } from "@/lib/seo-content";

type FaqProps = {
  items?: FaqItem[];
  titleLead?: string;
  titleRest?: string;
  intro?: string;
};

export function Faq({
  items = homeFaqs,
  titleLead = "Common",
  titleRest = "questions about hiring a private chef",
  intro = "Straight answers for guests booking in-villa dining across Lombok — including Kuta, Senggigi, and Mandalika.",
}: FaqProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="section-pad bg-surface-warm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-3xl">
        <Reveal variant="up" className="text-center">
          <h2 className="font-display text-2xl leading-snug text-ink sm:text-3xl md:text-4xl">
            <span className="text-candle">{titleLead}</span> {titleRest}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink/70 sm:mt-4 sm:text-base">
            {intro}
          </p>
        </Reveal>

        <ul className="mt-10 space-y-3 sm:mt-12 sm:space-y-4">
          {items.map((item, index) => (
            <Reveal
              key={item.question}
              as="li"
              delay={Math.min(index, 3) as 0 | 1 | 2 | 3}
              variant="up"
            >
              <details className="group border border-ink/10 bg-surface-cream open:bg-surface-white">
                <summary className="cursor-pointer list-none px-5 py-4 font-display text-base text-ink marker:content-none sm:px-6 sm:py-5 sm:text-lg [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{item.question}</span>
                    <span
                      aria-hidden
                      className="mt-1 shrink-0 text-candle transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="border-t border-ink/8 px-5 pb-5 pt-3 text-sm leading-relaxed text-ink/75 sm:px-6 sm:pb-6 sm:text-base">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
