import { Reveal } from "@/components/Reveal";
import { SplitHeading } from "@/components/SplitHeading";

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
    >
      <div className="mx-auto max-w-5xl text-center">
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

        <Reveal
          delay={1}
          variant="fade"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
        >
          <StarRating rating={average} size="lg" />
          <p className="text-sm text-ink/70">
            <span className="font-medium text-ink">
              {average.toFixed(1)} / 5
            </span>{" "}
            from {stories.length} guest reviews
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-12 sm:grid-cols-2 md:grid-cols-3 md:gap-x-10 md:gap-y-14">
          {stories.map((story, index) => (
            <Reveal
              key={story.name}
              as="li"
              delay={(index % 3) as 0 | 1 | 2}
              variant="up"
              className="flex flex-col items-center"
            >
              <StarRating rating={story.rating} />
              <blockquote className="mt-3 font-display text-lg leading-snug text-ink sm:text-xl md:text-2xl">
                “{story.quote}”
              </blockquote>
              <p className="mt-3 text-sm leading-relaxed text-ink/70 sm:mt-4">
                {story.review}
              </p>
              <p className="mt-4 text-sm font-medium text-ink sm:mt-5">
                {story.name}
              </p>
              <p className="mt-1 text-xs text-ink/60 sm:text-sm">{story.place}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) {
  const rounded = Math.round(rating);
  const starClass = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <div
      className="flex items-center justify-center gap-1 text-candle"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rounded;
        return (
          <svg
            key={index}
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={`${starClass} ${filled ? "fill-current" : "fill-candle/25"}`}
          >
            <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
          </svg>
        );
      })}
    </div>
  );
}
