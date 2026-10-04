import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import { Headset, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl shadow-slate-900/[0.08] lg:min-h-[620px] lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex xl:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/35 via-slate-950 to-slate-950" />
          <div className="absolute -bottom-28 -left-16 size-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-16 -left-4 size-56 rounded-full border border-white/10" />
          <div className="relative flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <Headset className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              ServiceDesk
            </span>
          </div>
          <div className="relative max-w-md">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-indigo-100">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Support that keeps you moving
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Great work starts with the right support.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Submit a request, follow its progress, and stay focused on what
              matters most.
            </p>
          </div>
          <div className="relative flex items-center gap-2 text-sm text-slate-300">
            <ShieldCheck className="size-4 text-indigo-300" aria-hidden="true" />
            Your requests, organized in one secure place
          </div>
        </aside>
        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-14">
          <div className="w-full max-w-sm">
            <div className="mb-8 lg:hidden">
              <span className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Headset className="size-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-primary">ServiceDesk</p>
            </div>
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold text-primary">
                Welcome back
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Pick up right where you left off.
              </p>
            </div>
            <Suspense>
              <LoginForm />
            </Suspense>
            <p className="mt-7 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
