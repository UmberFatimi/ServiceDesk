import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RequestCard } from "@/components/request-card";
import { RequestFilters } from "@/components/request-filters";
import { Pagination } from "@/components/pagination";
import { apiFetch } from "@/lib/api";
import { STATUSES, type ListResponse, type Stats } from "@/lib/types";

export type DashboardSearchParams = {
  status?: string;
  search?: string;
  page?: string;
};

export async function RequestsDashboard({
  basePath,
  isAdmin,
  searchParams,
}: {
  basePath: string;
  isAdmin: boolean;
  searchParams: DashboardSearchParams;
}) {
  const status = STATUSES.find((s) => s === searchParams.status);
  const search = searchParams.search?.slice(0, 100);
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  const qs = new URLSearchParams({ page: String(page), limit: "6" });
  if (status) qs.set("status", status);
  if (search) qs.set("search", search);

  const [stats, list] = await Promise.all([
    apiFetch<Stats>("/requests/stats"),
    apiFetch<ListResponse>(`/requests?${qs.toString()}`),
  ]);

  const summary: [string, number][] = [
    ["Total", stats.total],
    ...STATUSES.map((s): [string, number] => [s, stats[s]]),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isAdmin ? "All requests" : "My requests"}
        </h1>
        <Link href={`${basePath}/requests/new`} className={buttonVariants()}>
          New request
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {summary.map(([label, count]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-semibold">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <RequestFilters />

      {list.data.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {status || search
              ? "No requests match your filters."
              : "No requests yet. Create your first one!"}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.data.map((r) => (
            <RequestCard
              key={r._id}
              request={r}
              basePath={basePath}
              showOwner={isAdmin}
            />
          ))}
        </div>
      )}

      <Pagination
        page={list.pagination.page}
        pages={list.pagination.pages}
        basePath={basePath}
        params={{ status, search }}
      />
    </div>
  );
}
