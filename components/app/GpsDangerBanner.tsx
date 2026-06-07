"use client";

import { useGPSTracking } from "@/hooks/useGPSTracking";

export default function GpsDangerBanner() {
  const { dangerAlert, clearDangerAlert } = useGPSTracking(true);

  if (!dangerAlert) return null;

  return (
    <div className="mb-4 rounded-xl border border-[var(--red)]/40 bg-[var(--red-muted)] p-4">
      <p className="text-[14px] font-semibold text-[var(--red)]">{dangerAlert.message}</p>
      <button
        type="button"
        onClick={clearDangerAlert}
        className="mt-2 text-[12px] text-[var(--text-muted)] underline"
      >
        Dismiss
      </button>
    </div>
  );
}
