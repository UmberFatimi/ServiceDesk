import Link from "next/link";
import { RegisterForm } from "@/components/register-form";
import { Headset } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl shadow-slate-900/[0.08] lg:min-h-[620px] lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex xl:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/35 via-slate-950 to-slate-950" />
          <div className="absolute -bottom-28 -left-16 size-80 rounded-full border border-white/10" />
          <div className="relative flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <Headset className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              ServiceDesk
            </span>
          </div>
          <div className="relative max-w-md">
            <p className="mb-4 text-sm font-semibold text-indigo-200">
              A smoother way to get things done
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Help is one request away.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Create your account to submit service requests and keep track of
              every update.
            </p>
          </div>
          <p className="relative text-sm text-slate-400">
            Simple requests. Clear progress. Better support.
          </p>
        </aside>
        <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="w-full max-w-sm">
            <div className="mb-7 lg:hidden">
              <span className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Headset className="size-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-primary">ServiceDesk</p>
            </div>
            <div className="mb-7">
              <p className="mb-2 text-sm font-semibold text-primary">
                Get started
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">
                Create your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Join your team and manage service requests with ease.
              </p>
            </div>
            <RegisterForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
