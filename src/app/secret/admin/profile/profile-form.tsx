"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Field, inputClass, textareaClass } from "@/components/form";
import Button from "@/components/ui/button/Button";

type ProfileFormProps = {
  username: string;
  whatsappNumber: string;
  locationLabel: string;
  locationAddress: string;
  locationLat: number;
  locationLng: number;
  mapsLink: string;
};

export function WebProfileForm(props: ProfileFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(props.username);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState(props.whatsappNumber);
  const [locationLabel, setLocationLabel] = useState(props.locationLabel);
  const [locationAddress, setLocationAddress] = useState(props.locationAddress);
  const [locationLat, setLocationLat] = useState(String(props.locationLat));
  const [locationLng, setLocationLng] = useState(String(props.locationLng));
  const [mapsLink, setMapsLink] = useState(props.mapsLink);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password && password !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password: password || undefined,
          whatsapp_number: whatsappNumber,
          location_label: locationLabel,
          location_address: locationAddress,
          location_lat: locationLat,
          location_lng: locationLng,
          maps_link: mapsLink,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Could not save profile.");
      }

      setPassword("");
      setConfirmPassword("");
      setSuccess("Profile saved.");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save profile.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error ? <Alert>{error}</Alert> : null}
      {success ? (
        <div className="rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-600 dark:border-success-500/30 dark:bg-success-500/15 dark:text-success-500">
          {success}
        </div>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
          Admin login
        </h2>
        <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
          Password is stored encrypted (hashed) in the database. Leave blank to
          keep the current password.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Username">
            <input
              className={inputClass}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </Field>
          <div className="hidden sm:block" />
          <Field label="New password">
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Leave blank to keep current"
            />
          </Field>
          <Field label="Confirm new password">
            <input
              type="password"
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Repeat new password"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
          WhatsApp
        </h2>
        <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
          International number without + or spaces. Used for booking buttons on
          the website.
        </p>
        <div className="mt-5 max-w-md">
          <Field label="WhatsApp number">
            <input
              className={inputClass}
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              inputMode="numeric"
              placeholder="6287858018811"
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
          Google location
        </h2>
        <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
          Controls the map embed and “Open in Google Maps” link on the site.
        </p>

        <div className="mt-5 space-y-4">
          <Field label="Location label">
            <input
              className={inputClass}
              value={locationLabel}
              onChange={(e) => setLocationLabel(e.target.value)}
              required
            />
          </Field>
          <Field label="Address">
            <textarea
              className={textareaClass}
              rows={2}
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              required
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Latitude">
              <input
                className={inputClass}
                value={locationLat}
                onChange={(e) => setLocationLat(e.target.value)}
                inputMode="decimal"
                required
              />
            </Field>
            <Field label="Longitude">
              <input
                className={inputClass}
                value={locationLng}
                onChange={(e) => setLocationLng(e.target.value)}
                inputMode="decimal"
                required
              />
            </Field>
          </div>
          <Field label="Google Maps link">
            <input
              className={inputClass}
              value={mapsLink}
              onChange={(e) => setMapsLink(e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              required
            />
          </Field>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
