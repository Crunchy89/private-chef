import { getSiteCms } from "@/lib/drive-cms";
import { CmsImage } from "@/components/CmsImage";

export async function Hero() {
  const content = await getSiteCms();

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <CmsImage
        src={content.heroImage}
        alt="Private chef dinner service at a villa in Lombok"
        fill
        priority
        className="animate-drift object-cover object-center brightness-[0.85]"
      />
      <div className="animate-veil absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-4 pb-14 pt-24 text-center sm:px-10 sm:pb-16 sm:pt-28 lg:px-16 lg:pb-24">
        <div className="max-w-3xl">
          <p className="animate-rise font-display text-xl tracking-[0.02em] text-candle [text-shadow:0_2px_16px_rgba(0,0,0,0.65)] sm:text-3xl md:text-4xl">
            {content.name}
          </p>
          <h1 className="animate-rise-delay-1 mt-4 font-display text-[1.85rem] leading-[1.12] tracking-tight text-cream [text-shadow:0_2px_20px_rgba(0,0,0,0.7)] sm:mt-5 sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-7xl">
            <span className="text-candle">Private chef</span> service for your
            villa in Lombok.
          </h1>
          <p className="animate-rise-delay-2 mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream [text-shadow:0_2px_14px_rgba(0,0,0,0.7)] sm:mt-5 sm:text-base md:text-lg">
            We come to your kitchen, cook a custom menu, and leave the table
            ready for you — from Kuta Lombok to Senggigi, Mandalika, and beyond.
          </p>
          <div className="animate-rise-delay-2 mt-7 flex flex-wrap justify-center gap-3 sm:mt-9">
            <a
              href="#location"
              className="inline-flex items-center justify-center rounded-full bg-candle px-6 py-3 text-sm font-medium tracking-wide text-ink shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:bg-cream sm:px-7 sm:py-3.5"
            >
              Service area
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
