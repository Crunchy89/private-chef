"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Field, inputClass, selectClass, textareaClass } from "@/components/form";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

const emptyForm = {
  name: "",
  place: "",
  quote: "",
  review: "",
  rating: "5",
  status: "1",
};

export function AddReviewAction() {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm(emptyForm);
      setError("");
      setSubmitting(false);
    }
  }, [isOpen]);

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          place: form.place,
          quote: form.quote,
          review: form.review,
          rating: Number(form.rating),
          status: Number(form.status),
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Could not save review.");
      }

      closeModal();
      router.replace("/secret/admin");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save review.",
      );
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button type="button" size="sm" onClick={openModal}>
        Add review
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-lg p-6 sm:p-8">
        <div className="pr-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">
            Add review
          </h2>
          <p className="mt-1.5 text-theme-sm text-gray-500 dark:text-gray-400">
            Create a guest review manually. Newest reviews appear first.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error ? <Alert>{error}</Alert> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Guest name">
              <input
                required
                maxLength={80}
                className={inputClass}
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Guest name"
              />
            </Field>
            <Field label="Place">
              <input
                maxLength={120}
                className={inputClass}
                value={form.place}
                onChange={(e) => updateField("place", e.target.value)}
                placeholder="Villa / area"
              />
            </Field>
          </div>

          <Field label="Quote">
            <textarea
              required
              maxLength={500}
              rows={3}
              className={textareaClass}
              value={form.quote}
              onChange={(e) => updateField("quote", e.target.value)}
              placeholder="Short review quote shown on the site"
            />
          </Field>

          <Field label="Full review (optional)">
            <textarea
              maxLength={500}
              rows={3}
              className={textareaClass}
              value={form.review}
              onChange={(e) => updateField("review", e.target.value)}
              placeholder="Longer notes if needed"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rating">
              <select
                className={selectClass}
                value={form.rating}
                onChange={(e) => updateField("rating", e.target.value)}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} / 5
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                className={selectClass}
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                <option value="1">Show</option>
                <option value="0">Hide</option>
              </select>
            </Field>
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={closeModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Saving…" : "Save review"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
