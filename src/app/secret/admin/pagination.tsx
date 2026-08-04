import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  basePath?: string;
};

export function AdminPagination({
  page,
  totalPages,
  total,
  pageSize,
  basePath = "/secret/admin",
}: PaginationProps) {
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const prevHref =
    page <= 2 ? basePath : `${basePath}?page=${page - 1}`;
  const nextHref = `${basePath}?page=${page + 1}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 dark:border-gray-800">
      <p className="text-theme-sm text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-medium text-gray-800 dark:text-white/90">
          {from}–{to}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-800 dark:text-white/90">
          {total}
        </span>
        <span className="text-gray-400"> · latest first</span>
      </p>

      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={prevHref}
            className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-2 text-theme-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
          >
            Previous
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center justify-center rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-400 ring-1 ring-inset ring-gray-200 opacity-60 dark:ring-gray-800">
            Previous
          </span>
        )}

        <span className="min-w-16 text-center text-theme-sm text-gray-600 dark:text-gray-400">
          {page} / {totalPages}
        </span>

        {page < totalPages ? (
          <Link
            href={nextHref}
            className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-2 text-theme-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
          >
            Next
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center justify-center rounded-lg px-3 py-2 text-theme-sm font-medium text-gray-400 ring-1 ring-inset ring-gray-200 opacity-60 dark:ring-gray-800">
            Next
          </span>
        )}
      </div>
    </div>
  );
}
