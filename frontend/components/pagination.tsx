import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export function Pagination({
  page,
  pages,
  basePath,
  params,
}: {
  page: number;
  pages: number;
  basePath: string;
  params: Record<string, string | undefined>;
}) {
  if (pages <= 1) return null;

  const href = (p: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
    qs.set("page", String(p));
    return `${basePath}?${qs.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className={buttonVariants({ variant: "outline" })}
        >
          Previous
        </Link>
      ) : (
        <Button variant="outline" disabled>
          Previous
        </Button>
      )}

      <span className="text-sm text-muted-foreground">
        Page {page} of {pages}
      </span>

      {page < pages ? (
        <Link
          href={href(page + 1)}
          className={buttonVariants({ variant: "outline" })}
        >
          Next
        </Link>
      ) : (
        <Button variant="outline" disabled>
          Next
        </Button>
      )}
    </div>
  );
}
