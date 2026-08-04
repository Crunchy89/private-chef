"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ReviewRow } from "@/lib/reviews-db";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPagination } from "./pagination";

type AdminReviewsTableProps = {
  reviews: ReviewRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function AdminReviewsTable({
  reviews,
  page,
  pageSize,
  total,
  totalPages,
}: AdminReviewsTableProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ReviewRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function setStatus(id: string, status: 0 | 1) {
    setError("");
    setBusyId(id);
    try {
      const response = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Update failed.");
      }
      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Update failed.",
      );
    } finally {
      setBusyId(null);
    }
  }

  function closeDeleteModal() {
    if (deleting) return;
    setPendingDelete(null);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setError("");
    setDeleting(true);
    setBusyId(pendingDelete.id);
    try {
      const response = await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pendingDelete.id }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Delete failed.");
      }
      setPendingDelete(null);
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Delete failed.",
      );
    } finally {
      setDeleting(false);
      setBusyId(null);
    }
  }

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-theme-sm text-gray-500 dark:text-gray-400">
          No reviews yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        {error ? (
          <p className="border-b border-error-200 bg-error-50 px-4 py-3 text-theme-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/15 dark:text-error-400">
            {error}
          </p>
        ) : null}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Guest
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Quote
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Rating
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => {
                const visible = review.status === 1;
                const busy = busyId === review.id;
                return (
                  <TableRow
                    key={review.id}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <TableCell className="px-4 py-3 align-top">
                      <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        {review.name}
                      </p>
                      <p className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
                        {review.place}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-md px-4 py-3 align-top text-theme-sm text-gray-600 dark:text-gray-300">
                      “{review.quote}”
                    </TableCell>
                    <TableCell className="px-4 py-3 align-top text-theme-sm text-gray-700 dark:text-gray-300">
                      {review.rating}/5
                    </TableCell>
                    <TableCell className="px-4 py-3 align-top">
                      <span
                        className={
                          visible
                            ? "inline-flex rounded-full bg-success-50 px-2.5 py-1 text-theme-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500"
                            : "inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-theme-xs font-medium text-gray-600 dark:bg-white/[0.06] dark:text-gray-400"
                        }
                      >
                        {visible ? "Show" : "Hide"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-top">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          disabled={busy}
                          onClick={() => setStatus(review.id, visible ? 0 : 1)}
                        >
                          {visible ? "Hide" : "Show"}
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          variant="danger"
                          disabled={busy}
                          onClick={() => setPendingDelete(review)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
        />
      </div>

      <Modal
        isOpen={Boolean(pendingDelete)}
        onClose={closeDeleteModal}
        className="max-w-md p-6 sm:p-8"
      >
        <div className="pr-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">
            Delete review
          </h2>
          <p className="mt-2 text-theme-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Delete the review from{" "}
            <span className="font-medium text-gray-800 dark:text-white/90">
              {pendingDelete?.name}
            </span>
            ? This cannot be undone.
          </p>
          {pendingDelete?.quote ? (
            <p className="mt-3 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-theme-sm text-gray-600 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300">
              “{pendingDelete.quote}”
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={closeDeleteModal}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            variant="danger"
            onClick={confirmDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
