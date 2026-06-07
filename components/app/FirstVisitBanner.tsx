"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "trueroute_first_visit_dismissed";

export default function FirstVisitBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-[var(--gold)]/35 bg-[var(--gold-muted)]/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[13px] font-semibold text-[var(--gold)]">New in Nepal?</p>
        <p className="mt-1 text-[13px] text-[var(--text-muted)]">
          Download the offline pack on WiFi — fair prices, emergency numbers, and phrases work
          without mobile data.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Link
          href="/profile"
          className="rounded-lg bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-4 py-2 text-[13px] font-semibold text-white"
        >
          Download offline pack
        </Link>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(KEY, "1");
            setShow(false);
          }}
          className="rounded-lg border border-white/15 px-3 py-2 text-[12px] text-[var(--text-muted)]"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
