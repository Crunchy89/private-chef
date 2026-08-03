import Image from "next/image";

export function About() {
  return (
    <section id="about" className="bg-surface-b">
      <div className="mx-auto grid max-w-6xl items-center lg:grid-cols-2">
        <div className="relative flex min-h-[320px] w-full items-center justify-center sm:min-h-[420px] lg:min-h-[560px]">
          <Image
            src="/images/img1.png"
            alt="Guests toasting together at a private dining table"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain object-center p-4 sm:p-6"
            priority
          />
        </div>

        <div className="flex flex-col justify-center px-6 py-16 text-center sm:px-10 lg:px-16 lg:py-24 lg:text-left">
          <h2 className="font-display text-3xl tracking-tight text-lagoon sm:text-4xl md:text-5xl">
            Gather around the table
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">
            A private chef night in Lombok is built for shared plates, slow
            conversation, and the people you travel with. We cook where you
            stay — so the celebration stays at your villa.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/70 sm:text-lg">
            From intimate dinners for two to tables of friends, every menu is
            shaped around your guests, your timing, and the island’s fresh
            ingredients.
          </p>
        </div>
      </div>
    </section>
  );
}
