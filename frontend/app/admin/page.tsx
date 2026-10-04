import {
  RequestsDashboard,
  type DashboardSearchParams,
} from "@/components/requests/requests-dashboard";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  return (
    <RequestsDashboard
      basePath="/admin"
      isAdmin={true}
      searchParams={await searchParams}
    />
  );
}
