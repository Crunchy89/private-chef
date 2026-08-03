import Image from "next/image";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Image
        src={site.heroImage}
        alt="Private dining table set for an intimate meal"
        fill
        priority
        sizes="100vw"
        className="animate-drift object-cover object-center brightness-[0.85]"
      />
      <div className="animate-veil absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-6 pb-16 pt-28 text-center sm:px-10 lg:px-16 lg:pb-24">
        <div className="max-w-3xl">
          <p className="animate-rise font-display text-2xl tracking-[0.02em] text-candle [text-shadow:0_2px_16px_rgba(0,0,0,0.65)] sm:text-3xl md:text-4xl">
            {site.name}
          </p>
          <h1 className="animate-rise-delay-1 mt-5 font-display text-4xl leading-[1.05] tracking-tight text-cream [text-shadow:0_2px_20px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-candle">Intimate</span> dining, cooked where
            you stay.
          </h1>
          <p className="animate-rise-delay-2 mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream [text-shadow:0_2px_14px_rgba(0,0,0,0.7)] sm:text-lg">
            Seasonal Indonesian and modern plates, prepared in your villa —
            from Kuta Lombok across the island.
          </p>
          <div className="animate-rise-delay-2 mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="#location"
              className="inline-flex items-center justify-center rounded-full bg-candle px-7 py-3.5 text-sm font-medium tracking-wide text-ink shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:bg-cream"
            >
              See location
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
