import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SplitHeading } from "@/components/SplitHeading";

export function Chef() {
  return (
    <section id="chef" className="bg-surface-gray">
      <div className="mx-auto grid max-w-6xl items-center lg:grid-cols-2">
        <Reveal
          variant="left"
          className="order-2 flex flex-col justify-center px-6 py-16 text-center sm:px-10 lg:order-1 lg:px-16 lg:py-24 lg:text-left"
        >
          <SplitHeading
            lead="Your"
            rest="private chef in Lombok"
            className="text-3xl sm:text-4xl md:text-5xl"
          />
          <p className="mt-5 text-base leading-relaxed text-ink sm:text-lg">
            Every plate is finished by hand — fresh seafood, island produce,
            and careful plating brought to your villa kitchen. No restaurant
            rush. Just focused cooking for your table.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink sm:text-lg">
            Tell us your preferences, allergies, and guest count on WhatsApp.
            We plan the menu, shop, cook, and leave you to enjoy the night.
          </p>
        </Reveal>

        <Reveal
          variant="right"
          delay={1}
          className="relative order-1 flex min-h-[320px] w-full items-center justify-center sm:min-h-[420px] lg:order-2 lg:min-h-[560px]"
        >
          <Image
            src="/images/img2.png"
            alt="Private chef plating a gourmet dish"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain object-center p-4 sm:p-6"
          />
        </Reveal>
      </div>
    </section>
  );
}
