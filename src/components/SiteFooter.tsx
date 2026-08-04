type SiteFooterProps = {
  siteName: string;
};

export function SiteFooter({ siteName }: SiteFooterProps) {
  return (
    <footer
      className="bg-black px-6 py-10 text-cream sm:px-10 lg:px-16"
      style={{ backgroundColor: "#121212" }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <p className="font-display text-base text-candle sm:text-lg">
          {siteName}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-cream/60 sm:gap-x-6 sm:gap-y-3 sm:text-sm">
          <a href="/#reviews" className="transition-colors hover:text-candle">
            Reviews
          </a>
          <a href="/how-to-book" className="transition-colors hover:text-candle">
            How to book
          </a>
          <a href="/kuta-lombok" className="transition-colors hover:text-candle">
            Kuta
          </a>
          <a href="/senggigi" className="transition-colors hover:text-candle">
            Senggigi
          </a>
          <a href="/mandalika" className="transition-colors hover:text-candle">
            Mandalika
          </a>
          <a href="/#location" className="transition-colors hover:text-candle">
            Location
          </a>
        </div>
      </div>
    </footer>
  );
}
