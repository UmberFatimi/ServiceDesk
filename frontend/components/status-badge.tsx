import { Badge } from "@/components/ui/badge";
import type { Status } from "@/lib/types";

const styles: Record<Status, string> = {
  Pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Cancelled: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant="outline" className={`border-transparent ${styles[status]}`}>
      {status}
    </Badge>
  );
}
