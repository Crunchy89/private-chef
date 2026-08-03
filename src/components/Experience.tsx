"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { site, whatsappBookingUrl } from "@/lib/site";

const actions = [
  {
    id: "whatsapp",
    title: "Book the chef",
    copy: "Message us on WhatsApp with your villa location, dates, and guest count. We reply with menu options and pricing.",
    href: whatsappBookingUrl(),
    external: true,
  },
  {
    id: "share",
    title: "Share with hosts",
    copy: "Send this page to friends or your villa host so they can book the same private chef service in Lombok.",
  },
  {
    id: "direction",
    title: "Where we cook",
    copy: "We are based in Kuta Lombok and travel to villas and holiday homes across the island.",
    href: site.location.mapsLink,
    external: true,
  },
] as const;

export function Experience() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const payload = {
      title: site.name,
      text: site.tagline,
      url: site.url,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch {
      return;
    }

    try {
      await navigator.clipboard.writeText(site.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      id="experience"
      className="bg-surface-cream px-4 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <ul className="grid gap-12 md:grid-cols-3 md:gap-10">
          {actions.map((item, index) => {
            const delay = Math.min(index, 3) as 0 | 1 | 2 | 3;

            const content = (
              <>
                <span className="inline-flex h-12 w-12 items-center justify-center text-ink transition-transform duration-300 group-hover:scale-110 group-hover:text-candle">
                  {item.id === "whatsapp" && <WhatsAppIcon />}
                  {item.id === "share" && <ShareIcon />}
                  {item.id === "direction" && <DirectionIcon />}
                </span>
                <h3 className="mt-4 font-display text-lg text-ink sm:mt-5 sm:text-xl md:text-2xl">
                  {item.id === "share" && copied ? "Link copied" : item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:mt-3 sm:text-base">
                  {item.copy}
                </p>
              </>
            );

            if (item.id === "share") {
              return (
                <Reveal key={item.id} as="li" delay={delay} variant="up">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="group flex w-full flex-col items-center text-center transition-opacity hover:opacity-90"
                  >
                    {content}
                  </button>
                </Reveal>
              );
            }

            return (
              <Reveal key={item.id} as="li" delay={delay} variant="up">
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="group flex flex-col items-center text-center transition-opacity hover:opacity-90"
                >
                  {content}
                </a>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 fill-current">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.15h-.01c-1.55 0-3.06-.42-4.38-1.21l-.31-.19-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.69-8.23 8.24-8.23 4.54 0 8.23 3.69 8.23 8.23 0 4.54-3.69 8.23-8.23 8.23z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8 fill-none stroke-current"
      strokeWidth="1.5"
    >
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.4 13.2l7.2 4.2M15.6 6.6l-7.2 4.2" strokeLinecap="round" />
    </svg>
  );
}

function DirectionIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8 fill-none stroke-current"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"
      />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}
