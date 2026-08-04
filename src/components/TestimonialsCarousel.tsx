"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";

export type ReviewCard = {
  quote: string;
  name: string;
  place: string;
  rating: number;
  review: string;
};

type TestimonialsCarouselProps = {
  stories: ReviewCard[];
  average: number;
};

function getVisibleCount(width: number) {
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
}

export function TestimonialsCarousel({
  stories,
  average,
}: TestimonialsCarouselProps) {
  const [visible, setVisible] = useState(3);
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const settling = useRef(false);

  const total = stories.length;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);
    updateMotion();
    motion.addEventListener("change", updateMotion);

    const updateVisible = () => setVisible(getVisibleCount(window.innerWidth));
    updateVisible();
    window.addEventListener("resize", updateVisible);

    return () => {
      motion.removeEventListener("change", updateMotion);
      window.removeEventListener("resize", updateVisible);
    };
  }, []);

  // Keep a middle copy of the list so we can slide continuously, then snap
  useEffect(() => {
    if (total === 0) return;
    setOffset(total + index);
    setAnimate(false);
  }, [total, visible]);

  const goNext = useCallback(() => {
    if (total === 0 || settling.current) return;
    setAnimate(true);
    setOffset((value) => value + 1);
    setIndex((value) => (value + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total === 0 || settling.current) return;
    setAnimate(true);
    setOffset((value) => value - 1);
    setIndex((value) => (value - 1 + total) % total);
  }, [total]);

  const goTo = useCallback(
    (next: number) => {
      if (total === 0 || settling.current) return;
      const target = ((next % total) + total) % total;
      const delta = target - index;
      if (delta === 0) return;
      setAnimate(true);
      setOffset((value) => value + delta);
      setIndex(target);
    },
    [index, total],
  );

  function handleTransitionEnd() {
    if (total === 0) return;
    // Snap back to the middle copy without a visible jump
    const normalized = total + index;
    if (offset !== normalized) {
      settling.current = true;
      setAnimate(false);
      setOffset(normalized);
      requestAnimationFrame(() => {
        settling.current = false;
      });
    }
  }

  const track = total === 0 ? [] : [...stories, ...stories, ...stories];
  const stepPercent = 100 / visible;

  return (
    <>
      <Reveal
        delay={1}
        variant="fade"
        className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
      >
        <StarRating rating={average} size="lg" />
        <p className="text-sm text-ink/70">
          <span className="font-medium text-ink">{average.toFixed(1)} / 5</span>{" "}
          from {stories.length} guest review{stories.length === 1 ? "" : "s"}
        </p>
      </Reveal>

      <div className="relative mt-12 sm:mt-14">
        <div className="overflow-hidden">
          <div
            className="flex ease-out"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(-${offset * stepPercent}%)`,
              transitionProperty: "transform",
              transitionDuration:
                animate && !reducedMotion ? "500ms" : "0ms",
            }}
          >
            {track.map((story, trackIndex) => (
              <article
                key={`${trackIndex}-${story.name}`}
                className="box-border flex shrink-0 flex-col px-2"
                style={{ width: `${stepPercent}%` }}
              >
                <div className="flex h-full flex-col rounded-2xl border border-ink/10 bg-surface-white p-5 text-left shadow-[0_8px_24px_rgba(42,33,24,0.06)] sm:p-6">
                  <StarRating rating={story.rating} className="justify-start" />
                  <blockquote className="mt-4 flex-1 font-display text-base leading-snug text-ink sm:text-lg">
                    “{story.quote}”
                  </blockquote>
                  {story.review && (
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">
                      {story.review}
                    </p>
                  )}
                  <div className="mt-5 border-t border-ink/8 pt-4">
                    <p className="text-sm font-medium text-ink">{story.name}</p>
                    <p className="mt-0.5 text-xs text-ink/60 sm:text-sm">
                      {story.place}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {total > 1 && (
          <>
            <CarouselButton
              label="Previous review"
              direction="prev"
              onClick={goPrev}
              className="-left-1 sm:-left-4 lg:-left-5"
            />
            <CarouselButton
              label="Next review"
              direction="next"
              onClick={goNext}
              className="-right-1 sm:-right-4 lg:-right-5"
            />

            <div
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
              role="tablist"
              aria-label="Review cards"
            >
              {stories.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  role="tab"
                  aria-selected={dotIndex === index}
                  aria-label={`Go to review ${dotIndex + 1} of ${total}`}
                  onClick={() => goTo(dotIndex)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    dotIndex === index
                      ? "w-6 bg-candle"
                      : "w-2 bg-ink/20 hover:bg-ink/35"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function CarouselButton({
  label,
  direction,
  onClick,
  className,
}: {
  label: string;
  direction: "prev" | "next";
  onClick: () => void;
  className: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-surface-white text-ink shadow-md transition-colors hover:border-candle hover:text-candle sm:h-11 sm:w-11 ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-none stroke-current stroke-[1.75]"
      >
        {direction === "prev" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
        )}
      </svg>
    </button>
  );
}

function StarRating({
  rating,
  size = "sm",
  className = "",
}: {
  rating: number;
  size?: "sm" | "lg";
  className?: string;
}) {
  const rounded = Math.round(rating);
  const starClass = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <div
      className={`flex items-center justify-center gap-1 text-candle ${className}`}
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
