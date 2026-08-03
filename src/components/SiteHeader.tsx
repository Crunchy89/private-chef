"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const links = [
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#chef", label: "Chef" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#location", label: "Location" },
];

export function SiteHeader() {
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

  const onHero = !scrolled && !open;

  return (
    <header
      className={`safe-fixed-header fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        onHero
          ? "bg-gradient-to-b from-black/55 via-black/25 to-transparent"
          : "border-b border-ink/8 bg-surface-a/95 text-ink shadow-[0_1px_0_rgba(20,24,22,0.04)] backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:gap-6 sm:px-10 sm:py-4 lg:px-16">
        <a
          href="#"
          className={`min-w-0 truncate font-display text-base tracking-[0.01em] sm:text-lg md:text-xl ${
            onHero ? "text-candle" : "text-ink"
          }`}
          onClick={() => setOpen(false)}
        >
          {site.name}
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors hover:text-candle ${
                onHero ? "text-cream" : "text-ink/70 hover:text-candle"
              }`}
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
              className={`absolute left-0 h-px w-full transition-transform duration-300 ${
                onHero ? "bg-cream" : "bg-ink"
              } ${open ? "top-1.5 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 top-1.5 h-px w-full transition-opacity duration-300 ${
                onHero ? "bg-cream" : "bg-ink"
              } ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute left-0 h-px w-full transition-transform duration-300 ${
                onHero ? "bg-cream" : "bg-ink"
              } ${open ? "top-1.5 -rotate-45" : "top-3"}`}
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
          className="border-t border-ink/10 bg-surface-a px-4 py-6 sm:px-10"
        >
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-1 font-display text-xl text-ink sm:text-2xl"
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
