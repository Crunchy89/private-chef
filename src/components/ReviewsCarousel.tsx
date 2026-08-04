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

type ReviewsCarouselProps = {
  stories: ReviewCard[];
  average: number;
  count: number;
};

const SWIPE_THRESHOLD_PX = 48;

function getVisibleCount(width: number) {
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
}

export function ReviewsCarousel({
  stories,
  average,
  count,
}: ReviewsCarouselProps) {
  const [visible, setVisible] = useState(1);
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const dragPxRef = useRef(0);
  const lockRef = useRef<"x" | "y" | null>(null);

  const total = stories.length;
  // Keep card width at the responsive 1/2/3-column size even with fewer reviews.
  const columns = Math.max(1, visible);
  const maxIndex = Math.max(0, total - columns);
  const canNavigate = total > columns;

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

  useEffect(() => {
    setIndex((value) => Math.min(value, maxIndex));
  }, [maxIndex]);

  const goNext = useCallback(() => {
    if (!canNavigate) return;
    setIndex((value) => Math.min(value + 1, maxIndex));
  }, [canNavigate, maxIndex]);

  const goPrev = useCallback(() => {
    if (!canNavigate) return;
    setIndex((value) => Math.max(value - 1, 0));
  }, [canNavigate]);

  const goTo = useCallback(
    (next: number) => {
      if (!canNavigate) return;
      setIndex(Math.min(Math.max(next, 0), maxIndex));
    },
    [canNavigate, maxIndex],
  );

  function endSwipe(target?: HTMLDivElement, pointerId?: number) {
    if (
      target &&
      pointerId != null &&
      target.hasPointerCapture(pointerId)
    ) {
      target.releasePointerCapture(pointerId);
    }

    const delta = dragPxRef.current;
    pointerIdRef.current = null;
    lockRef.current = null;
    dragPxRef.current = 0;
    setDragPx(0);
    setDragging(false);

    if (!canNavigate || Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta < 0) goNext();
    else goPrev();
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!canNavigate || event.button !== 0) return;
    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;
    lockRef.current = null;
    dragPxRef.current = 0;
    setDragPx(0);
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;

    const dx = event.clientX - startXRef.current;
    const dy = event.clientY - startYRef.current;

    if (!lockRef.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      lockRef.current = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      if (lockRef.current === "y") {
        endSwipe(event.currentTarget, event.pointerId);
        return;
      }
    }

    if (lockRef.current !== "x") return;

    event.preventDefault();
    const atStart = index <= 0 && dx > 0;
    const atEnd = index >= maxIndex && dx < 0;
    const next = atStart || atEnd ? dx * 0.35 : dx;
    dragPxRef.current = next;
    setDragPx(next);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;
    endSwipe(event.currentTarget, event.pointerId);
  }

  const stepPercent = 100 / columns;
  const pageCount = maxIndex + 1;
  const dragPercent = viewportRef.current
    ? (dragPx / viewportRef.current.clientWidth) * 100
    : 0;

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
          from {count} guest review{count === 1 ? "" : "s"}
        </p>
      </Reveal>

      <div className="mt-12 sm:mt-14">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {canNavigate && (
            <CarouselButton
              label="Previous review"
              direction="prev"
              disabled={index === 0}
              onClick={goPrev}
            />
          )}

          <div
            ref={viewportRef}
            className={`min-w-0 flex-1 overflow-hidden touch-pan-y ${
              canNavigate ? "cursor-grab active:cursor-grabbing" : ""
            }`}
            style={{ backgroundColor: "var(--surface-warm)" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div
              className="flex py-3 ease-out"
              style={{
                backgroundColor: "var(--surface-warm)",
                transform: `translateX(calc(-${index * stepPercent}% + ${dragPercent}%))`,
                transitionProperty: "transform",
                transitionDuration:
                  dragging || reducedMotion ? "0ms" : "500ms",
              }}
            >
              {stories.map((story, storyIndex) => (
                <article
                  key={`${story.name}-${storyIndex}`}
                  className="box-border flex shrink-0 flex-col px-1.5 sm:px-2 select-none"
                  style={{
                    width: `${stepPercent}%`,
                    backgroundColor: "var(--surface-warm)",
                  }}
                >
                  <div className="flex h-full flex-col rounded-2xl border border-ink/10 bg-surface-white p-5 text-left sm:p-6">
                    <StarRating rating={story.rating} className="justify-start" />
                    <blockquote className="mt-4 flex-1 font-display text-base leading-snug text-ink sm:text-lg">
                      “{story.quote}”
                    </blockquote>
                    {story.review && story.review !== story.quote ? (
                      <p className="mt-3 text-sm leading-relaxed text-ink/70">
                        {story.review}
                      </p>
                    ) : null}
                    <div className="mt-5 border-t border-ink/8 pt-4">
                      <p className="text-sm font-medium text-ink">{story.name}</p>
                      {story.place ? (
                        <p className="mt-0.5 text-xs text-ink/60 sm:text-sm">
                          {story.place}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {canNavigate && (
            <CarouselButton
              label="Next review"
              direction="next"
              disabled={index >= maxIndex}
              onClick={goNext}
            />
          )}
        </div>

        {canNavigate && pageCount > 1 && (
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Review cards"
          >
            {Array.from({ length: pageCount }, (_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                role="tab"
                aria-selected={dotIndex === index}
                aria-label={`Go to review set ${dotIndex + 1} of ${pageCount}`}
                onClick={() => goTo(dotIndex)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  dotIndex === index
                    ? "w-6 bg-candle"
                    : "w-2 bg-ink/20 hover:bg-ink/35"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function CarouselButton({
  label,
  direction,
  onClick,
  disabled = false,
}: {
  label: string;
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-surface-white text-ink shadow-md transition-colors hover:border-candle hover:text-candle disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink/10 disabled:hover:text-ink sm:h-11 sm:w-11"
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
      {Array.from({ length: 5 }, (_, starIndex) => {
        const filled = starIndex < rounded;
        return (
          <svg
            key={starIndex}
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
