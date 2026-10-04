"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUSES } from "@/lib/types";

export function RequestFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [pending, startTransition] = useTransition();

  function update(changes: Record<string, string | undefined>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes))
      v ? next.set(k, v) : next.delete(k);
    next.delete("page"); 
    startTransition(() => router.replace(`${pathname}?${next.toString()}`));
  }

  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("search") ?? "") !== search.trim())
        update({ search: search.trim() || undefined });
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="Search by title or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-sm"
      />
      <Select
        value={params.get("status") ?? "all"}
        onValueChange={(v) =>
          update({ status: !v || v === "all" ? undefined : v })
        }
      >
        <SelectTrigger className="sm:w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {pending && (
        <span className="self-center text-sm text-muted-foreground">
          Loading...
        </span>
      )}
    </div>
  );
}
