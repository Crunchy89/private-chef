import { Reveal } from "@/components/Reveal";
import { SplitHeading } from "@/components/SplitHeading";

const stories = [
  {
    quote:
      "He turned our Senggigi villa kitchen into the best meal of the trip. Effortless from the first WhatsApp message.",
    name: "Hannah & Mark",
    place: "Villa stay, Senggigi",
    rating: 5,
    review: "Food, timing, and cleanup were all flawless.",
  },
  {
    quote:
      "We booked for six friends near Kuta Lombok. Fresh fish, warm service, and zero logistics on our side.",
    name: "Priya R.",
    place: "Group dinner, South Lombok",
    rating: 5,
    review: "Menus tailored perfectly to our dietary needs.",
  },
  {
    quote:
      "Shared the page with our hosts — they booked again the next week. Perfect for guests who want something personal.",
    name: "Villa Amara",
    place: "Host recommendation",
    rating: 5,
    review: "Our guests keep asking us for the WhatsApp number.",
  },
  {
    quote:
      "Anniversary dinner on the terrace — quiet, generous portions, and a dessert that still gets mentioned.",
    name: "Tomás L.",
    place: "Couple dinner, Mangsit",
    rating: 5,
    review: "Felt like a restaurant without leaving the villa.",
  },
  {
    quote:
      "Cooked for our family of eight including kids. Patient, flexible, and the sambal was unforgettable.",
    name: "The Chen family",
    place: "Family stay, Bangsal",
    rating: 4,
    review: "Great value and very easy to arrange on WhatsApp.",
  },
  {
    quote:
      "We sent the link to friends arriving the next week. Same chef, same high standard — booking took two messages.",
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
      className="bg-surface-warm px-6 py-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-5xl text-center">
        <Reveal variant="up">
          <SplitHeading
            lead="Guests,"
            rest="then friends of guests"
            className="text-3xl sm:text-4xl md:text-5xl"
          />
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink sm:text-lg">
            Word travels fast on the island — here is what recent tables said.
          </p>
        </Reveal>

        <Reveal delay={1} variant="fade" className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
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
              <blockquote className="mt-3 font-display text-xl leading-snug text-ink sm:text-2xl">
                “{story.quote}”
              </blockquote>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                {story.review}
              </p>
              <p className="mt-5 text-sm font-medium text-ink">{story.name}</p>
              <p className="mt-1 text-sm text-ink/60">{story.place}</p>
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
