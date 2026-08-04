import { Reveal } from "@/components/Reveal";
import { SplitHeading } from "@/components/SplitHeading";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";

const stories = [
  {
    quote:
      "We booked Private Chef Lombok for our Senggigi villa. The chef handled everything — shopping, cooking, and clean-up. Best dinner of the trip.",
    name: "Hannah & Mark",
    place: "Villa dinner, Senggigi",
    rating: 5,
    review: "Professional private chef service from start to finish.",
  },
  {
    quote:
      "Six of us near Kuta Lombok. Fresh seafood, clear pricing on WhatsApp, and no restaurant transfers. Exactly what we needed.",
    name: "Priya R.",
    place: "Group booking, South Lombok",
    rating: 5,
    review: "Menus adapted perfectly to our dietary needs.",
  },
  {
    quote:
      "We recommend this private chef service to every guest at our villa. Easy to book and consistently excellent.",
    name: "Villa Amara",
    place: "Villa host, Lombok",
    rating: 5,
    review: "Our guests keep asking for the WhatsApp number.",
  },
  {
    quote:
      "Anniversary dinner on the terrace with a private chef. Quiet, generous portions, and dessert we still talk about.",
    name: "Tomás L.",
    place: "Couple dinner, Mangsit",
    rating: 5,
    review: "Felt like fine dining without leaving the villa.",
  },
  {
    quote:
      "Family of eight including kids. Patient cooking, flexible menu, and great local flavours. Highly recommend for Lombok stays.",
    name: "The Chen family",
    place: "Family villa, Bangsal",
    rating: 4,
    review: "Easy WhatsApp booking and fair value.",
  },
  {
    quote:
      "Booked again for friends arriving the next week. Same private chef service, same standard — arranged in two messages.",
    name: "Sofia & Luca",
    place: "Repeat booking, Kuta Lombok",
    rating: 5,
    review: "Reliable enough that we already rebooked.",
  },
];

const average =
  stories.reduce((sum, story) => sum + story.rating, 0) / stories.length;

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-surface-warm px-4 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24"
      style={{ backgroundColor: "var(--surface-warm)" }}
    >
      <div className="mx-auto max-w-6xl text-center">
        <Reveal variant="up">
          <SplitHeading
            lead="Guests"
            rest="who booked our chef in Lombok"
            className="text-2xl leading-snug sm:text-3xl md:text-4xl lg:text-5xl"
          />
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink sm:mt-4 sm:text-base md:text-lg">
            Real feedback from villa stays and holiday homes across the island.
          </p>
        </Reveal>

        <TestimonialsCarousel stories={stories} average={average} />
      </div>
    </section>
  );
}
