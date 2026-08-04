"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, inputClass, textareaClass } from "@/components/form";
import { Tooltip } from "@/components/Tooltip";
import Button from "@/components/ui/button/Button";
import { useNotifyTooltip } from "@/hooks/useNotifyTooltip";

type ProfileFormProps = {
  username: string;
  whatsappNumber: string;
  whatsappMessage: string;
  locationLabel: string;
  locationAddress: string;
  locationLat: number;
  locationLng: number;
  mapsLink: string;
};

export function WebProfileForm(props: ProfileFormProps) {
  const router = useRouter();
  const notice = useNotifyTooltip();
  const [username, setUsername] = useState(props.username);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState(props.whatsappNumber);
  const [whatsappMessage, setWhatsappMessage] = useState(
    () => props.whatsappMessage,
  );
  const [locationLabel, setLocationLabel] = useState(props.locationLabel);
  const [locationAddress, setLocationAddress] = useState(props.locationAddress);
  const [locationLat, setLocationLat] = useState(String(props.locationLat));
  const [locationLng, setLocationLng] = useState(String(props.locationLng));
  const [mapsLink, setMapsLink] = useState(props.mapsLink);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    notice.clear();

    if (password && password !== confirmPassword) {
      notice.notify("New password and confirmation do not match.", "error");
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
          whatsapp_message: whatsappMessage,
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
      notice.notify("Profile saved.", "success");
      router.refresh();
    } catch (submitError) {
      notice.notify(
        submitError instanceof Error
          ? submitError.message
          : "Could not save profile.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
              disabled={submitting}
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
              disabled={submitting}
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
              disabled={submitting}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white/90">
          WhatsApp
        </h2>
        <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
          Number and first message used when guests tap booking buttons on the
          website.
        </p>
        <div className="mt-5 space-y-4">
          <div className="max-w-md">
            <Field label="WhatsApp number">
              <input
                className={inputClass}
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                inputMode="numeric"
                placeholder="6287858018811"
                required
                disabled={submitting}
              />
            </Field>
            <p className="mt-1.5 text-theme-xs text-gray-500 dark:text-gray-400">
              International number without + or spaces.
            </p>
          </div>
          <Field label="First message">
            <textarea
              className={textareaClass}
              rows={4}
              name="whatsapp_message"
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              required
              disabled={submitting}
            />
          </Field>
          <p className="text-theme-xs text-gray-500 dark:text-gray-400">
            Pre-filled text in WhatsApp when a guest starts a chat from the
            site.
          </p>
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
              disabled={submitting}
            />
          </Field>
          <Field label="Address">
            <textarea
              className={textareaClass}
              rows={2}
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              required
              disabled={submitting}
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
                disabled={submitting}
              />
            </Field>
            <Field label="Longitude">
              <input
                className={inputClass}
                value={locationLng}
                onChange={(e) => setLocationLng(e.target.value)}
                inputMode="decimal"
                required
                disabled={submitting}
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
              disabled={submitting}
            />
          </Field>
        </div>
      </section>

      <div className="flex justify-end">
        <Tooltip
          open={notice.open}
          tone={notice.tone}
          content={notice.message || "Save profile"}
          placement="top"
        >
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Save profile"}
          </Button>
        </Tooltip>
      </div>
    </form>
  );
}
