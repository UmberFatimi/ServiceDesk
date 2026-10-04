"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Err = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-sm text-destructive">{msg}</p> : null;

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterInput) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const fieldErrors: { field: string; message: string }[] =
          data.errors ?? [];
        const known = ["name", "email", "password"];
        let placed = false;
        for (const er of fieldErrors) {
          if (known.includes(er.field)) {
            setError(er.field as "name" | "email" | "password", {
              message: er.message,
            });
            placed = true;
          }
        }
        if (!placed)
          setError("root", { message: data.message ?? "Registration failed" });
        return;
      }

      toast.success("Account created. Welcome!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("root", { message: "Network error. Please try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Your name"
          className="h-11 rounded-xl px-3"
          {...register("name")}
        />
        <Err msg={errors.name?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="h-11 rounded-xl px-3"
          {...register("email")}
        />
        <Err msg={errors.email?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          className="h-11 rounded-xl px-3"
          {...register("password")}
        />
        <Err msg={errors.password?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          className="h-11 rounded-xl px-3"
          {...register("confirmPassword")}
        />
        <Err msg={errors.confirmPassword?.message} />
      </div>

      <Err msg={errors.root?.message} />

      <Button
        type="submit"
        className="mt-1 h-11 w-full rounded-xl shadow-md shadow-primary/15"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
