import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestForm } from "@/components/request-form";

export default function NewRequestPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>New request</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestForm mode="create" basePath="/admin" isAdmin={true} />
        </CardContent>
      </Card>
    </div>
  );
}
