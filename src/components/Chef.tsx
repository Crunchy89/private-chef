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
            lead="What"
            rest="our private chef service includes"
            className="text-3xl sm:text-4xl md:text-5xl"
          />
          <p className="mt-5 text-base leading-relaxed text-ink sm:text-lg">
            Menu planning, fresh market ingredients, cooking in your kitchen,
            plating, and clean-up. You enjoy the meal — we handle the work
            behind it.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink sm:text-lg">
            Share allergies, spice level, and preferences on WhatsApp. We
            confirm availability for your Lombok dates and send a clear quote
            before you book.
          </p>
        </Reveal>

        <Reveal
          variant="right"
          delay={1}
          className="relative order-1 flex min-h-[320px] w-full items-center justify-center sm:min-h-[420px] lg:order-2 lg:min-h-[560px]"
        >
          <Image
            src="/images/img2.png"
            alt="Private chef preparing a plated dish for villa dining in Lombok"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain object-center p-4 sm:p-6"
          />
        </Reveal>
      </div>
    </section>
  );
}
