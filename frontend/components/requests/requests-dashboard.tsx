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
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">
            {isAdmin ? "Service overview" : "Your workspace"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {isAdmin ? "All requests" : "My requests"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isAdmin
              ? "Review and manage service requests across your team."
              : "Keep an eye on your requests and their latest status."}
          </p>
        </div>
        <Link
          href={`${basePath}/requests/new`}
          className={buttonVariants({
            className:
              "h-10 rounded-xl px-4 shadow-md shadow-primary/15 transition-transform hover:-translate-y-0.5",
          })}
        >
          New request
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {summary.map(([label, count], index) => (
          <Card
            key={label}
            className="border-border/70 shadow-sm shadow-slate-950/[0.03] transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <CardContent className="p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <p
                className={`mt-2 text-3xl font-semibold tracking-tight ${
                  index === 0 ? "text-primary" : ""
                }`}
              >
                {count}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm shadow-slate-950/[0.03] sm:p-5">
        <RequestFilters />
      </div>

      {list.data.length === 0 ? (
        <Card className="border-dashed border-border shadow-none">
          <CardContent className="py-14 text-center">
            <p className="text-base font-medium text-foreground">
            {status || search
              ? "No requests match your filters."
              : "No requests yet. Create your first one!"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {status || search
                ? "Try adjusting your search or selected status."
                : "Your submitted requests will appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
