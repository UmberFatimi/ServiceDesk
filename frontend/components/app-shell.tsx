import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/logout-button";
import type { CurrentUser } from "@/lib/types";

export function AppShell({
  user,
  basePath,
  children,
}: {
  user: CurrentUser;
  basePath: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href={basePath} className="font-semibold">
            ServiceDesk
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.name}
            </span>
            <Badge variant="secondary" className="capitalize  text-indigo-500 bg-indigo-200">
              {user.role}
            </Badge>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
