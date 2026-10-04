import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatBudget } from "@/lib/requests";
import type { ServiceRequest } from "@/lib/types";

export function RequestCard({
  request,
  basePath,
  showOwner,
}: {
  request: ServiceRequest;
  basePath: string;
  showOwner?: boolean;
}) {
  return (
    <Link href={`${basePath}/requests/${request._id}`} className="block h-full">
      <Card className="h-full transition hover:border-primary/50 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1 text-base">
              {request.title}
            </CardTitle>
            <StatusBadge status={request.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {request.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span>{request.category}</span>
            <span className="font-medium">{formatBudget(request.budget)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{showOwner ? request.user?.name : ""}</span>
            <span>
              {new Date(request.createdAt).toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
