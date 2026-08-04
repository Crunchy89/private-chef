"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Field, inputClass, textareaClass } from "@/components/form";
import Button from "@/components/ui/button/Button";
import type { SiteContentFields } from "@/lib/site-content";

type PreviewContentFormProps = {
  initial: SiteContentFields;
};

export function PreviewContentForm({ initial }: PreviewContentFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof SiteContentFields>(
    key: K,
    value: SiteContentFields[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        content?: SiteContentFields;
      };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Could not save content.");
      }
      if (data.content) setForm(data.content);
      setSuccess("Content saved. Live site updated.");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save content.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? <Alert>{error}</Alert> : null}
      {success ? (
        <div className="rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-600 dark:border-success-500/30 dark:bg-success-500/15 dark:text-success-500">
          {success}
        </div>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
          Header
        </h2>
        <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
          Brand name shown in the top nav and footer.
        </p>
        <div className="mt-5 max-w-xl">
          <Field label="Site name">
            <input
              className={inputClass}
              value={form.site_name}
              onChange={(e) => update("site_name", e.target.value)}
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
          Hero
        </h2>
        <div className="mt-5 space-y-4">
          <Field label="Hero title">
            <input
              className={inputClass}
              value={form.hero_title}
              onChange={(e) => update("hero_title", e.target.value)}
              required
            />
          </Field>
          <Field label="Hero subtitle">
            <textarea
              className={textareaClass}
              rows={3}
              value={form.hero_subtitle}
              onChange={(e) => update("hero_subtitle", e.target.value)}
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
          About
        </h2>
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title lead">
              <input
                className={inputClass}
                value={form.about_title_lead}
                onChange={(e) => update("about_title_lead", e.target.value)}
                required
              />
            </Field>
            <Field label="Title rest">
              <input
                className={inputClass}
                value={form.about_title_rest}
                onChange={(e) => update("about_title_rest", e.target.value)}
                required
              />
            </Field>
          </div>
          <Field label="Body (separate paragraphs with a blank line)">
            <textarea
              className={textareaClass}
              rows={5}
              value={form.about_body}
              onChange={(e) => update("about_body", e.target.value)}
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
          Chef
        </h2>
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title lead">
              <input
                className={inputClass}
                value={form.chef_title_lead}
                onChange={(e) => update("chef_title_lead", e.target.value)}
                required
              />
            </Field>
            <Field label="Title rest">
              <input
                className={inputClass}
                value={form.chef_title_rest}
                onChange={(e) => update("chef_title_rest", e.target.value)}
                required
              />
            </Field>
          </div>
          <Field label="Body (separate paragraphs with a blank line)">
            <textarea
              className={textareaClass}
              rows={5}
              value={form.chef_body}
              onChange={(e) => update("chef_body", e.target.value)}
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
          Reviews
        </h2>
        <div className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title lead">
              <input
                className={inputClass}
                value={form.reviews_title_lead}
                onChange={(e) => update("reviews_title_lead", e.target.value)}
                required
              />
            </Field>
            <Field label="Title rest">
              <input
                className={inputClass}
                value={form.reviews_title_rest}
                onChange={(e) => update("reviews_title_rest", e.target.value)}
                required
              />
            </Field>
          </div>
          <Field label="Intro">
            <textarea
              className={textareaClass}
              rows={3}
              value={form.reviews_body}
              onChange={(e) => update("reviews_body", e.target.value)}
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
          Location heading
        </h2>
        <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
          Map address and WhatsApp are edited under Web Profile.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Title lead">
            <input
              className={inputClass}
              value={form.location_title_lead}
              onChange={(e) => update("location_title_lead", e.target.value)}
              required
            />
          </Field>
          <Field label="Title rest">
            <input
              className={inputClass}
              value={form.location_title_rest}
              onChange={(e) => update("location_title_rest", e.target.value)}
              required
            />
          </Field>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save content"}
        </Button>
      </div>
    </form>
  );
}
