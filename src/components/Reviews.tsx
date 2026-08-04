import { Reveal } from "@/components/Reveal";
import { SplitHeading } from "@/components/SplitHeading";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { getSiteCms } from "@/lib/site-cms";

export async function Reviews() {
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
      id="reviews"
      className="section-pad bg-surface-warm"
      style={{ backgroundColor: "var(--surface-warm)" }}
    >
      <div className="mx-auto max-w-6xl text-center">
        <Reveal variant="up">
          <SplitHeading
            lead={content.content.reviewsTitleLead}
            rest={content.content.reviewsTitleRest}
            className="text-2xl leading-snug sm:text-3xl md:text-4xl lg:text-5xl"
          />
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink sm:mt-4 sm:text-base md:text-lg">
            {content.content.reviewsBody}
          </p>
        </Reveal>

        <ReviewsCarousel
          stories={stories}
          average={content.average}
          count={content.count}
        />
      </div>
    </section>
  );
}
