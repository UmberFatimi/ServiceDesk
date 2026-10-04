import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { RequestActions } from "@/components/request-actions";
import { formatBudget, formatDate, getRequest } from "@/lib/requests";

export async function RequestDetails({
  id,
  basePath,
  isAdmin,
}: {
  id: string;
  basePath: string;
  isAdmin: boolean;
}) {
  const request = await getRequest(id);

  const fields: [string, string][] = [
    ["Category", request.category],
    ["Budget", formatBudget(request.budget)],
    ["Created", formatDate(request.createdAt)],
    ["Last updated", formatDate(request.updatedAt)],
    ...(isAdmin && request.user
      ? [
          ["Requested by", `${request.user.name} (${request.user.email})`] as [
            string,
            string,
          ],
        ]
      : []),
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        href={basePath}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Back to requests
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-xl">{request.title}</CardTitle>
            <StatusBadge status={request.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {request.description}
          </p>

          <dl className="grid gap-4 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <RequestActions
            request={request}
            basePath={basePath}
            isAdmin={isAdmin}
          />
        </CardContent>
      </Card>
    </div>
  );
}
