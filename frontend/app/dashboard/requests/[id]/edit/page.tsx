import { RequestEditor } from "@/components/requests/request-editor";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RequestEditor id={id} basePath="/dashboard" isAdmin={false} />;
}
