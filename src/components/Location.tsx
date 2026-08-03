import { Reveal } from "@/components/Reveal";
import { SplitHeading } from "@/components/SplitHeading";
import { site } from "@/lib/site";

export function Location() {
  return (
    <section
      id="location"
      className="bg-surface-dark px-4 py-16 text-cream sm:px-10 sm:py-20 lg:px-16 lg:py-24"
    >
      <div className="mx-auto max-w-5xl text-center">
        <Reveal variant="up">
          <SplitHeading
            lead="Service"
            rest="area across Lombok"
            tone="dark"
            className="text-2xl leading-snug sm:text-3xl md:text-4xl lg:text-5xl"
          />
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-cream/75 sm:mt-4 sm:text-base md:text-lg">
            {site.location.label}. Send your villa pin when you book and we
            confirm travel for your private chef dinner.
          </p>
        </Reveal>

        <Reveal
          delay={1}
          variant="scale"
          className="mt-10 overflow-hidden border border-cream/15 text-left"
        >
          <iframe
            title="Private Chef Lombok location map"
            src={`https://www.google.com/maps?q=${site.location.lat},${site.location.lng}&z=13&output=embed`}
            className="h-[min(420px,55vh)] w-full border-0 grayscale-[20%] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </Reveal>

        <Reveal
          delay={2}
          variant="fade"
          className="mt-6 flex flex-col items-center gap-3"
        >
          <p className="text-sm text-cream/65">{site.location.address}</p>
          <a
            href={site.location.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-lagoon underline-offset-4 transition-colors hover:text-cream hover:underline"
          >
            Open in Google Maps
          </a>
        </Reveal>
      </div>
    </section>
  );
}
