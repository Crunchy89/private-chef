import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            P
          </span>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white/90">
              Private Chef Lombok
            </h1>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">
              Admin sign in
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">
              Loading…
            </p>
          }
        >
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
