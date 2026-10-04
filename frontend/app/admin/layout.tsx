import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getCurrentUser } from "@/lib/requests";
import { AppShell } from "@/components/app-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/dashboard");
  const user = await getCurrentUser();
  return (
    <AppShell user={user} basePath="/admin">
      {children}
    </AppShell>
  );
}
