"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Field, inputClass } from "@/components/form";
import { Tooltip } from "@/components/Tooltip";
import Button from "@/components/ui/button/Button";
import { useNotifyTooltip } from "@/hooks/useNotifyTooltip";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notice = useNotifyTooltip(4000);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    notice.clear();
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Could not sign in.");
      }

      const next = searchParams.get("next");
      router.replace(
        next && next.startsWith("/secret/admin") ? next : "/secret/admin",
      );
      router.refresh();
    } catch (submitError) {
      notice.notify(
        submitError instanceof Error
          ? submitError.message
          : "Could not sign in.",
        "error",
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Username">
        <input
          type="text"
          name="username"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={inputClass}
          placeholder="admin"
          disabled={submitting}
        />
      </Field>

      <Field label="Password">
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClass}
          placeholder="Enter password"
          disabled={submitting}
        />
      </Field>

      <Tooltip
        open={notice.open}
        tone={notice.tone}
        content={notice.message || "Sign in"}
        className="w-full"
      >
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </Tooltip>
    </form>
  );
}
