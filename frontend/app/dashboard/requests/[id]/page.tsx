import { RequestDetails } from "@/components/requests/request-details";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RequestDetails id={id} basePath="/dashboard" isAdmin={false} />;
}
