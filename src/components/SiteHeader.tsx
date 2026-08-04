"use client";

import { useEffect, useState } from "react";
const links = [
  { href: "/#experience", label: "Experience" },
  { href: "/#about", label: "About" },
  { href: "/#chef", label: "Chef" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#location", label: "Location" },
];

type SiteHeaderProps = {
  siteName: string;
};

export function SiteHeader({ siteName }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`safe-fixed-header fixed inset-x-0 top-0 z-50 bg-black text-cream transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_rgba(255,243,228,0.08)]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:gap-6 sm:px-10 sm:py-4 lg:px-16">
        <a
          href="/"
          className="min-w-0 truncate font-display text-base tracking-[0.01em] text-candle sm:text-lg md:text-xl"
          onClick={() => setOpen(false)}
        >
          {siteName}
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-cream/80 transition-colors hover:text-candle"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close" : "Menu"}</span>
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 h-px w-full bg-cream transition-transform duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-px w-full bg-cream transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-full bg-cream transition-transform duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`md:hidden ${open ? "block" : "hidden"}`}
      >
        <nav
          aria-label="Mobile"
          className="border-t border-cream/10 bg-black px-4 py-5 sm:px-10"
        >
          <ul className="mx-auto flex max-w-xs flex-col items-center gap-2.5">
            {links.map((link) => (
              <li key={link.href} className="w-full">
                <a
                  href={link.href}
                  className="block rounded-full border border-cream/20 px-5 py-2.5 text-center text-sm tracking-wide text-cream transition-colors hover:border-candle hover:text-candle"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
