"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SplitHeading } from "@/components/SplitHeading";

type FormState = "idle" | "submitting" | "success" | "error";

export function ReviewForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (rating < 1) {
      setState("error");
      setError("Please select a star rating.");
      return;
    }

    setState("submitting");
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          quote: data.get("quote"),
          place: data.get("place"),
          review: data.get("review"),
          rating,
          website: data.get("website"),
        }),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Something went wrong.");
      }

      form.reset();
      setRating(0);
      setState("success");
    } catch (submitError) {
      setState("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not submit your review.",
      );
    }
  }

  return (
    <section
      id="review"
      className="border-t border-ink/8 bg-surface-white px-4 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24"
    >
      <div className="mx-auto max-w-xl text-center">
        <Reveal variant="up">
          <SplitHeading
            lead="Share"
            rest="your experience"
            className="text-2xl leading-snug sm:text-3xl md:text-4xl"
          />
          <p className="mt-3 text-sm leading-relaxed text-ink/70 sm:mt-4 sm:text-base">
            Had a private chef dinner in Lombok? Leave a review — it saves to
            our Drive content sheet and appears on the site.
          </p>
        </Reveal>

        <Reveal variant="up" delay={1}>
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-4 rounded-2xl border border-ink/8 bg-surface-cream p-6 text-left sm:p-8"
          >
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <label className="block">
              <span className="text-sm font-medium text-ink">Your name</span>
              <input
                name="name"
                required
                maxLength={80}
                className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-candle"
                placeholder="Hannah & Mark"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-ink">Short quote</span>
              <textarea
                name="quote"
                required
                maxLength={500}
                rows={3}
                className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-candle"
                placeholder="Best dinner of the trip — the chef handled everything."
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-ink">
                Where you stayed (optional)
              </span>
              <input
                name="place"
                maxLength={120}
                className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-candle"
                placeholder="Villa dinner, Senggigi"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-ink">
                More detail (optional)
              </span>
              <textarea
                name="review"
                maxLength={500}
                rows={3}
                className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-candle"
                placeholder="Menus adapted perfectly to our dietary needs."
              />
            </label>

            <fieldset className="text-center">
              <legend className="text-sm font-medium text-ink">Rating</legend>
              <div className="mt-3 flex justify-center gap-2 text-candle">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    onClick={() => setRating(value)}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className={`h-9 w-9 sm:h-10 sm:w-10 ${
                        value <= rating ? "fill-current" : "fill-candle/25"
                      }`}
                    >
                      <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
                    </svg>
                  </button>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={state === "submitting"}
              className="inline-flex w-full items-center justify-center rounded-full bg-candle px-6 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-cream disabled:opacity-60"
            >
              {state === "submitting" ? "Sending..." : "Submit review"}
            </button>

            {state === "success" && (
              <p className="text-center text-sm font-medium text-ink">
                Thank you — your review was saved.
              </p>
            )}
            {state === "error" && (
              <p className="text-center text-sm text-red-700">{error}</p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
