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
      basePath="/dashboard"
      isAdmin={false}
      searchParams={await searchParams}
    />
  );
}
