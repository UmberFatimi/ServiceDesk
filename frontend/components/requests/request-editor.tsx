import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestForm } from "@/components/request-form";
import { getRequest } from "@/lib/requests";

export async function RequestEditor({
  id,
  basePath,
  isAdmin,
}: {
  id: string;
  basePath: string;
  isAdmin: boolean;
}) {
  const request = await getRequest(id);

  if (!isAdmin && request.status !== "Pending")
    redirect(`${basePath}/requests/${id}`);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        href={`${basePath}/requests/${id}`}
        className="text-sm text-muted-foreground hover:underline"
      >
        ← Back to request
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit request</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestForm
            mode="edit"
            basePath={basePath}
            isAdmin={isAdmin}
            request={request}
          />
        </CardContent>
      </Card>
    </div>
  );
}
