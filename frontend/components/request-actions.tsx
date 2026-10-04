"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { clientFetch, ClientApiError } from "@/lib/client-api";
import type { ServiceRequest } from "@/lib/types";

function Confirm({
  label,
  variant,
  disabled,
  title,
  description,
  actionLabel,
  onConfirm,
}: {
  label: string;
  variant?: "outline" | "destructive";
  disabled?: boolean;
  title: string;
  description: string;
  actionLabel: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant={variant} disabled={disabled} />}
      >
        {label}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function RequestActions({
  request,
  basePath,
  isAdmin,
}: {
  request: ServiceRequest;
  basePath: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const canEdit = isAdmin || request.status === "Pending";
  const canCancel = !isAdmin && request.status === "Pending";

  async function run(
    fn: () => Promise<unknown>,
    success: string,
    after: () => void,
  ) {
    setBusy(true);
    try {
      await fn();
      toast.success(success);
      after();
    } catch (e) {
      toast.error(
        e instanceof ClientApiError
          ? e.message
          : "Network error. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {canEdit && (
        <Link
          href={`${basePath}/requests/${request._id}/edit`}
          className={buttonVariants()}
        >
          Edit
        </Link>
      )}

      {canCancel && (
        <Confirm
          label="Cancel request"
          variant="outline"
          disabled={busy}
          title="Cancel this request?"
          description="Its status will change to Cancelled and you won't be able to edit it afterwards."
          actionLabel="Yes, cancel it"
          onConfirm={() =>
            run(
              () =>
                clientFetch(`/requests/${request._id}`, {
                  method: "PUT",
                  body: JSON.stringify({ status: "Cancelled" }),
                }),
              "Request cancelled",
              () => router.refresh(),
            )
          }
        />
      )}

      {isAdmin && (
        <Confirm
          label="Delete"
          variant="destructive"
          disabled={busy}
          title="Delete this request?"
          description="This permanently removes the request and can't be undone."
          actionLabel="Delete"
          onConfirm={() =>
            run(
              () =>
                clientFetch(`/requests/${request._id}`, { method: "DELETE" }),
              "Request deleted",
              () => {
                router.push(basePath);
                router.refresh();
              },
            )
          }
        />
      )}
    </div>
  );
}
