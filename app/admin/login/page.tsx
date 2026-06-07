"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { createClientSafe } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
const FOUNDER_EMAIL = "yadavraj1244@gmail.com";

function errorMessage(code: string | null): string {
  switch (code) {
    case "supabase_required":
      return "Add Supabase keys to .env.local to use admin.";
    case "verify_email":
      return "Verify your Gmail in Supabase before admin access.";
    case "wrong_account":
      return `Only ${FOUNDER_EMAIL} can access the admin panel.`;
    default:
      return code ? decodeURIComponent(code) : "";
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(FOUNDER_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(errorMessage(searchParams.get("error")));
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (email.trim().toLowerCase() !== FOUNDER_EMAIL) {
      setError(`Only ${FOUNDER_EMAIL} can sign in.`);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: FOUNDER_EMAIL, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed.");
      return;
    }

    const next = searchParams.get("next") || "/admin";
    router.push(next);
    router.refresh();
  };

  const googleAdmin = async () => {
    if (!isSupabaseConfigured()) {
      setError("Google sign-in needs Supabase keys in .env.local. Use password below for local dev.");
      return;
    }
    const supabase = createClientSafe();
    if (!supabase) return;
    setLoading(true);
    const redirectTo = `${window.location.origin}/auth/admin-callback`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: { prompt: "select_account", hd: "gmail.com" },
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[var(--bg-card)] p-8">
        <div className="mb-8 text-center">
          <span className="text-4xl">🧭</span>
          <h1 className="mt-3 font-display text-2xl font-bold">
            True<span className="text-[var(--gold)]">Route</span> Admin
          </h1>
          <p className="mt-2 text-[14px] text-[var(--text-muted)]">
            Founder access only — {FOUNDER_EMAIL}
          </p>
        </div>

        {isSupabaseConfigured() ? (
          <>
            <button
              type="button"
              onClick={googleAdmin}
              disabled={loading}
              className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white py-3.5 text-[14px] font-semibold text-[#1a1a1a] hover:bg-gray-100 disabled:opacity-60"
            >
              Sign in with Google (founder Gmail)
            </button>
            <div className="mb-5 flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
              <span className="h-px flex-1 bg-white/10" />
              or password
              <span className="h-px flex-1 bg-white/10" />
            </div>
          </>
        ) : (
          <p className="mb-4 rounded-xl bg-[var(--teal-muted)] p-3 text-[12px] text-[var(--teal)]">
            Local dev: founder email + password from .env (ADMIN_PASSWORD).
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-[12px] font-medium text-[var(--text-mid)]">
            Founder email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] opacity-80 outline-none"
            />
          </label>
          <label className="block text-[12px] font-medium text-[var(--text-mid)]">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[var(--gold)]/40"
              placeholder="Your admin password"
              required
              minLength={8}
            />
          </label>
          {error && <p className="text-[13px] text-[var(--red)]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] py-3.5 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Enter admin panel"}
          </button>
        </form>
        <p className="mt-6 text-center text-[12px] text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--text)]">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
