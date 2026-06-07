"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClientSafe } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function VerifyPendingInner() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const resend = async () => {
    if (!email || !isSupabaseConfigured()) return;
    const supabase = createClientSafe();
    if (!supabase) return;
    setStatus("idle");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/map`,
      },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
      setMessage("Verification email sent. Check your inbox and spam folder.");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[var(--bg-card)] p-8 text-center">
      <span className="text-4xl">✉️</span>
      <h1 className="mt-4 font-display text-2xl font-bold">Verify your email</h1>
      <p className="mt-3 text-[14px] text-[var(--text-muted)]">
        We sent a confirmation link to{" "}
        <strong className="text-[var(--text)]">{email || "your email"}</strong>.
        Click the link before using your account — this keeps fake emails off TrueRoute.
      </p>
      <ol className="mt-6 space-y-2 text-left text-[13px] text-[var(--text-muted)]">
        <li>1. Open your inbox (and spam folder)</li>
        <li>2. Click “Confirm your email” from TrueRoute</li>
        <li>3. Return here and log in</li>
      </ol>
      {message && (
        <p
          className={`mt-4 text-[13px] ${status === "error" ? "text-[var(--red)]" : "text-[var(--teal)]"}`}
        >
          {message}
        </p>
      )}
      <button
        type="button"
        onClick={resend}
        className="mt-6 w-full rounded-xl border border-white/15 py-3 text-[14px] font-medium hover:bg-white/5"
      >
        Resend verification email
      </button>
      <Link
        href="/login"
        className="mt-4 inline-block text-[14px] font-semibold text-[var(--gold)] hover:underline"
      >
        Back to login
      </Link>
      <Link
        href="/map"
        className="mt-2 block text-[13px] text-[var(--text-muted)] hover:text-[var(--text)]"
      >
        Browse as guest (no account) →
      </Link>
    </div>
  );
}

export default function VerifyPendingPage() {
  return (
    <div className="grain flex min-h-screen items-center justify-center px-6 py-16">
      <Suspense fallback={<p className="text-[var(--text-muted)]">Loading…</p>}>
        <VerifyPendingInner />
      </Suspense>
    </div>
  );
}
