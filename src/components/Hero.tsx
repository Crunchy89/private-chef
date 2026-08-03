import Image from "next/image";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden text-surface-a">
      <Image
        src={site.heroImage}
        alt="Private dining table set for an intimate meal"
        fill
        priority
        sizes="100vw"
        className="animate-drift object-cover object-center"
      />
      <div className="animate-veil absolute inset-0 bg-gradient-to-t from-lagoon/90 via-lagoon/50 to-lagoon/20" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-6 pb-16 pt-28 text-center sm:px-10 lg:px-16 lg:pb-24">
        <div className="max-w-3xl">
          <p className="animate-rise font-display text-2xl tracking-[0.02em] sm:text-3xl md:text-4xl">
            {site.name}
          </p>
          <h1 className="animate-rise-delay-1 mt-5 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {site.tagline}
          </h1>
          <p className="animate-rise-delay-2 mx-auto mt-5 max-w-xl text-base leading-relaxed text-surface-a/85 sm:text-lg">
            Seasonal Indonesian and modern plates, prepared in your villa —
            from Kuta Lombok across the island.
          </p>
          <div className="animate-rise-delay-2 mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="#location"
              className="inline-flex items-center justify-center rounded-full border border-surface-a/40 px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 hover:border-surface-a hover:bg-surface-a/10"
            >
              See location
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
