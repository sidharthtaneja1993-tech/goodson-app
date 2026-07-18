"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linen px-6">
        <div className="max-w-sm text-center">
          <h1 className="font-display text-3xl text-ink">Check your email</h1>
          <p className="mt-3 text-sm text-slate">
            We&apos;ve sent a confirmation link to {email}. Follow it to activate
            your account.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linen px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-xl text-ink">
          Goodson
        </Link>
        <h1 className="font-display mt-6 text-3xl text-ink">Create an account</h1>
        <p className="mt-2 text-sm text-slate">
          Set up your family&apos;s Goodson dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
              Full name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
              Password
            </label>
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
            />
          </div>

          {error && <p className="text-sm text-rose-ash">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-paper hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-ink underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
