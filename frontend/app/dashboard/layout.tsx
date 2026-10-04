import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getCurrentUser } from "@/lib/requests";
import { AppShell } from "@/components/app-shell";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "admin") redirect("/admin");
  const user = await getCurrentUser();
  return (
    <AppShell user={user} basePath="/dashboard">
      {children}
    </AppShell>
  );
}
