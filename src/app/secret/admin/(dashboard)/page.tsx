import type { Metadata } from "next";
import PageHeader from "@/components/common/PageHeader";
import { AddReviewAction } from "../add-review-action";
import { AdminReviewsTable } from "../reviews-table";
import { listReviewsPage } from "@/lib/reviews-db";

export const metadata: Metadata = {
  title: "Reviews",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requested = Number(params.page);
  const page = Number.isFinite(requested) && requested > 0 ? requested : 1;
  const data = await listReviewsPage(page, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        description={`${data.visible} visible · ${data.hidden} hidden · ${data.total} total`}
        action={<AddReviewAction />}
      />
      <AdminReviewsTable
        reviews={data.reviews}
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
        totalPages={data.totalPages}
      />
    </div>
  );
}
