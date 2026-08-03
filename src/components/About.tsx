import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SplitHeading } from "@/components/SplitHeading";

export function About() {
  return (
    <section id="about" className="bg-surface-white">
      <div className="mx-auto grid max-w-6xl items-center lg:grid-cols-2">
        <Reveal
          variant="left"
          className="relative flex min-h-[320px] w-full items-center justify-center sm:min-h-[420px] lg:min-h-[560px]"
        >
          <Image
            src="/images/img1.png"
            alt="Guests enjoying a private chef dinner in a Lombok villa"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain object-center p-4 sm:p-6"
            priority
          />
        </Reveal>

        <Reveal
          variant="right"
          delay={1}
          className="flex flex-col justify-center px-6 py-16 text-center sm:px-10 lg:px-16 lg:py-24 lg:text-left"
        >
          <SplitHeading
            lead="Dining"
            rest="at your villa, not a restaurant"
            className="text-3xl sm:text-4xl md:text-5xl"
          />
          <p className="mt-5 text-base leading-relaxed text-ink sm:text-lg">
            Private Chef Lombok is an in-villa chef service. We shop, cook, and
            plate in your holiday home so you can host dinner without leaving
            the property.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink sm:text-lg">
            Ideal for couples, families, and friend groups who want a personal
            dining experience with Indonesian flavours, seafood, and flexible
            menus built around your guests.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
