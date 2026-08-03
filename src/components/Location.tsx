import { site } from "@/lib/site";

export function Location() {
  return (
    <section
      id="location"
      className="bg-surface-b px-6 py-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="font-display text-3xl tracking-tight text-lagoon sm:text-4xl md:text-5xl">
          Find us on the map
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
          {site.location.label}. We cook at villas and holiday homes across the
          island — tell us your pin when you book.
        </p>

        <div className="mt-10 overflow-hidden border border-lagoon/15 text-left">
          <iframe
            title="Private Chef Lombok location map"
            src={`https://www.google.com/maps?q=${site.location.lat},${site.location.lng}&z=13&output=embed`}
            className="h-[min(420px,55vh)] w-full border-0 grayscale-[20%] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-sm text-ink/65">{site.location.address}</p>
          <a
            href={site.location.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-lagoon underline-offset-4 transition-colors hover:underline"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
