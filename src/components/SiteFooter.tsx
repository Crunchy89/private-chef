import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer
      className="bg-black px-6 py-10 text-cream sm:px-10 lg:px-16"
      style={{ backgroundColor: "#121212" }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <p className="font-display text-base text-candle sm:text-lg">
          {site.name}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-cream/60 sm:gap-x-6 sm:gap-y-3 sm:text-sm">
          <a href="#testimonials" className="transition-colors hover:text-candle">
            Testimonials
          </a>
          <a href="#location" className="transition-colors hover:text-candle">
            Location
          </a>
        </div>
      </div>
    </footer>
  );
}
