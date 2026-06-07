"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getLocalProfile } from "@/lib/offline/local";
import { useEffect, useState } from "react";

export default function AppHeaderAuth() {
  const { user, loading, signOut, isVerified } = useAuth();
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    const p = getLocalProfile();
    if (p?.name) setGuestName(p.name);
  }, [user]);

  if (loading) {
    return <span className="text-[12px] text-[var(--text-muted)]">…</span>;
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    guestName;

  if (displayName) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className="max-w-[120px] truncate text-[13px] font-medium text-[var(--text)] hover:text-[var(--gold)] sm:max-w-[160px]"
        >
          {displayName}
        </Link>
        {user && !isVerified ? (
          <Link href="/auth/verify-pending" className="text-[12px] text-[var(--gold)] hover:underline">
            Verify email
          </Link>
        ) : user ? (
          <button
            type="button"
            onClick={() => signOut()}
            className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            Sign out
          </button>
        ) : (
          <Link href="/login" className="text-[12px] text-[var(--teal)] hover:underline">
            Link account
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-4 py-2 text-[13px] font-semibold text-white"
      >
        Sign up
      </Link>
    </div>
  );
}
