import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-surface-gray px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <p className="font-display text-lg text-ink">{site.name}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-ink/60">
          <a href="#testimonials" className="hover:text-lagoon">
            Testimonials
          </a>
          <a href="#location" className="hover:text-lagoon">
            Location
          </a>
        </div>
      </div>
    </footer>
  );
}
