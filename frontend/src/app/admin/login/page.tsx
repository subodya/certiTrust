"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-indigo-50 to-slate-100">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0ea5e9]">
        {/* Overlay Pattern for Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08)_0%,transparent_50%)]"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-indigo-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-blue-300/25 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6">
        <div className="grid w-full items-stretch gap-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/75 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
          <section className="hidden flex-col justify-between bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0ea5e9] p-10 text-white lg:flex">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4" />
                Admin Security Portal
              </div>
              <h1 className="text-3xl font-bold leading-tight">
                CertiTrust
                <br />
                Staff Login
              </h1>
              <p className="mt-4 max-w-sm text-sm text-slate-200">
                Access certificate operations, manage records, and keep verification data trusted and up to date.
              </p>
            </div>

          </section>

          <section className="flex items-center p-5 sm:p-8 lg:p-10">
            <form
              className="mx-auto w-full max-w-md space-y-5"
              onSubmit={async (event) => {
                event.preventDefault();
                if (isSubmitting) return;
                setError("");
                setIsSubmitting(true);
                try {
                  const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                  });
                  if (signInError) {
                    setError(signInError.message);
                    return;
                  }
                  router.replace("/admin/dashboard");
                  router.refresh();
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brand-primary)]">
                  Staff Portal
                </p>
                <h2 className="mt-1 text-3xl font-bold text-slate-900">Welcome back</h2>
                <p className="mt-1 text-sm text-slate-500">Sign in to continue to the Admin Dashboard.</p>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-[var(--color-brand-primary)] focus-within:ring-4 focus-within:ring-blue-100">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="admin@yourdomain.com"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-[var(--color-brand-primary)] focus-within:ring-4 focus-within:ring-blue-100">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="Enter your password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </label>

              {error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              ) : null}

              <button
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-primary)] font-semibold text-white transition hover:bg-[var(--color-brand-primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in to Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link href="/" className="block text-center text-sm font-medium text-slate-500 hover:text-slate-700">
                Back to Verification Home
              </Link>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
