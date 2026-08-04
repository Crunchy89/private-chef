import { Reveal } from "@/components/Reveal";
import { SplitHeading } from "@/components/SplitHeading";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { getSiteCms } from "@/lib/drive-cms";

export async function Testimonials() {
  const content = await getSiteCms();
  const stories = content.reviews.map((story) => ({
    quote: story.quote,
    name: story.name,
    place: story.place,
    rating: story.rating,
    review: story.review,
  }));

  if (stories.length === 0) return null;

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
            {content.source === "drive"
              ? "Guest reviews synced from our content sheet."
              : "Real feedback from villa stays and holiday homes across the island."}
          </p>
        </Reveal>

        <TestimonialsCarousel
          stories={stories}
          average={content.average}
          count={content.count}
        />
      </div>
    </section>
  );
}
