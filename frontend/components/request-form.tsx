"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { requestSchema, type RequestInput } from "@/lib/schemas";
import { clientFetch, ClientApiError } from "@/lib/client-api";
import { CATEGORIES, STATUSES, type ServiceRequest } from "@/lib/types";

type Props = {
  mode: "create" | "edit";
  basePath: string;
  isAdmin: boolean;
  request?: ServiceRequest;
};

const Err = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-sm text-destructive">{msg}</p> : null;

export function RequestForm({ mode, basePath, isAdmin, request }: Props) {
  const router = useRouter();
  const showStatus = isAdmin && mode === "edit";

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema),
    defaultValues: request
      ? {
          title: request.title,
          description: request.description,
          category: request.category,
          budget: request.budget,
          status: request.status,
        }
      : { title: "", description: "" },
  });

  async function onSubmit(values: RequestInput) {
    const {  ...rest } = values;
    const payload = showStatus ? values : rest; 

    try {
      const saved =
        mode === "create"
          ? await clientFetch<ServiceRequest>("/requests", {
              method: "POST",
              body: JSON.stringify(payload),
            })
          : await clientFetch<ServiceRequest>(`/requests/${request!._id}`, {
              method: "PUT",
              body: JSON.stringify(payload),
            });

      toast.success(mode === "create" ? "Request created" : "Request updated");
      router.push(`${basePath}/requests/${saved._id}`);
      router.refresh();
    } catch (e) {
      if (e instanceof ClientApiError) {
        e.errors?.forEach((er) =>
          setError(er.field as keyof RequestInput, { message: er.message }),
        );
        toast.error(e.message);
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        <Err msg={errors.title?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={5} {...register("description")} />
        <Err msg={errors.description?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Err msg={errors.category?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            step="any"
            min="0"
            {...register("budget", { valueAsNumber: true })}
          />
          <Err msg={errors.budget?.message} />
        </div>
      </div>

      {showStatus && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger id="status" className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create request"
              : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
