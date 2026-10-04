import Link from "next/link";
import { Headset } from "lucide-react";
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
    <div className="min-h-screen bg-background/70">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 shadow-sm shadow-slate-950/[0.02] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href={basePath} className="group flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:-rotate-3">
              <Headset className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight">
            ServiceDesk
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                Service request portal
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-medium">{user.name}</span>
            
            </span>
            <Badge variant="secondary" className="capitalize">
              {user.role}
            </Badge>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
    </div>
  );
}
