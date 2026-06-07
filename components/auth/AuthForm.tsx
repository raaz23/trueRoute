"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { saveLocalProfile } from "@/lib/offline/local";
import { validateTouristEmail } from "@/lib/auth/email-validation";

type Mode = "login" | "signup";

const nationalities = [
  "Nepal",
  "India",
  "USA",
  "UK",
  "Germany",
  "France",
  "Japan",
  "Australia",
  "Other",
];

function AuthFormInner({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/map";
  const urlError = searchParams.get("error");

  const {
    isConfigured,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInWithMagicLink,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("Other");
  const [error, setError] = useState(urlError ? decodeURIComponent(urlError) : "");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLink, setMagicLink] = useState(false);

  const isLogin = mode === "login";

  const guestContinue = () => {
    saveLocalProfile({
      name: "Guest Traveler",
      createdAt: new Date().toISOString(),
    });
    router.push("/map");
  };

  const handleGoogle = async () => {
    if (!isConfigured) {
      setError("Add Supabase keys to .env.local — see SETUP.md");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed");
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!isConfigured) {
      const check = validateTouristEmail(email);
      if (!check.ok) {
        setError(check.message);
        return;
      }
      if (!isLogin && !name.trim()) {
        setError("Enter your name.");
        return;
      }
      saveLocalProfile({
        name: name.trim() || email.split("@")[0],
        email,
        nationality: isLogin ? undefined : nationality,
        createdAt: new Date().toISOString(),
      });
      router.push(next);
      return;
    }

    setLoading(true);

    if (magicLink) {
      const res = await signInWithMagicLink(email);
      setLoading(false);
      if (res.error) setError(res.error);
      else setInfo("Check your email for the magic link.");
      return;
    }

    if (isLogin) {
      const res = await signInWithEmail(email, password);
      setLoading(false);
      if (res.error) setError(res.error);
      else router.push(next);
    } else {
      if (!name.trim()) {
        setError("Enter your name.");
        setLoading(false);
        return;
      }
      const res = await signUpWithEmail(email, password, { name, nationality });
      setLoading(false);
      if (res.error) setError(res.error);
      else if (res.needsConfirmation) {
        router.push(`/auth/verify-pending?email=${encodeURIComponent(email)}`);
      } else router.push(next);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <h1 className="font-display text-2xl font-bold">
        {isLogin ? "Welcome back" : "Join TrueRoute"}
      </h1>
      <p className="mt-1 text-[14px] text-[var(--text-muted)]">
        Real email required · we verify before your account works
      </p>

      {!isConfigured && (
        <p className="mt-4 rounded-xl bg-[var(--gold-muted)] p-3 text-[12px] text-[var(--gold)]">
          Local dev mode: email saved on this device. Add Supabase in .env for cloud accounts + Google.
        </p>
      )}

      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white py-3.5 text-[14px] font-semibold text-[#1a1a1a] hover:bg-gray-100 disabled:opacity-60"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
        <span className="h-px flex-1 bg-white/10" />
        or email
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form className="space-y-4" onSubmit={handleEmail}>
        {!isLogin && (
          <div>
            <label className="text-[12px] font-medium text-[var(--text-mid)]">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[var(--gold)]/40"
              required={isConfigured}
            />
          </div>
        )}
        <div>
          <label className="text-[12px] font-medium text-[var(--text-mid)]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[var(--gold)]/40"
            required
          />
        </div>
        {!magicLink && (
          <div>
            <label className="text-[12px] font-medium text-[var(--text-mid)]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[var(--gold)]/40"
              required={isConfigured && !magicLink}
            />
          </div>
        )}
        {!isLogin && isConfigured && (
          <div>
            <label className="text-[12px] font-medium text-[var(--text-mid)]">Nationality</label>
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px]"
            >
              {nationalities.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}
        {isLogin && isConfigured && (
          <button
            type="button"
            onClick={() => setMagicLink(!magicLink)}
            className="text-[12px] text-[var(--teal)] hover:underline"
          >
            {magicLink ? "Use password instead" : "Email me a magic link (no password)"}
          </button>
        )}
        {error && <p className="text-[12px] text-[var(--red)]">{error}</p>}
        {info && <p className="text-[12px] text-[var(--teal)]">{info}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
        >
          {loading
            ? "Please wait…"
            : magicLink
              ? "Send magic link"
              : isLogin
                ? "Log in"
                : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={guestContinue}
        className="mt-4 w-full rounded-xl border border-white/15 py-3 text-[14px] font-medium text-[var(--text-muted)] hover:bg-white/5"
      >
        Continue as guest — no account needed →
      </button>

      <p className="mt-6 text-center text-[14px] text-[var(--text-muted)]">
        {isLogin ? (
          <>
            No account?{" "}
            <Link href="/signup" className="font-semibold text-[var(--gold)] hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--gold)] hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

export default function AuthForm({ mode }: { mode: Mode }) {
  return (
    <Suspense fallback={<p className="text-[var(--text-muted)]">Loading…</p>}>
      <AuthFormInner mode={mode} />
    </Suspense>
  );
}
