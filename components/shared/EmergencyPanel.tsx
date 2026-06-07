"use client";

import type { OfflineEmergency } from "@/lib/offline/types";

type Props = {
  contacts: OfflineEmergency[];
  compact?: boolean;
};

export default function EmergencyPanel({ contacts, compact }: Props) {
  const call = (number: string) => {
    const tel = number.replace(/[^\d+]/g, "");
    window.location.href = `tel:${tel}`;
  };

  const copy = async (number: string, label: string) => {
    try {
      await navigator.clipboard.writeText(number);
      alert(`Copied ${label}: ${number}`);
    } catch {
      prompt("Copy this number:", number);
    }
  };

  const shareLocation = async () => {
    if (!navigator.geolocation) {
      alert("GPS not available on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const text = `TrueRoute SOS — I need help. My location: https://maps.google.com/?q=${latitude},${longitude}`;
        if (navigator.share) {
          try {
            await navigator.share({ title: "TrueRoute SOS", text });
            return;
          } catch {
            /* fall through */
          }
        }
        const sms = `sms:?body=${encodeURIComponent(text)}`;
        window.location.href = sms;
      },
      () => alert("Allow location access to share your position.")
    );
  };

  const defaultContacts: OfflineEmergency[] = [
    { id: "1", label: "Police", number: "100" },
    { id: "2", label: "Ambulance", number: "102" },
    { id: "3", label: "Tourist Police", number: "1144" },
    { id: "4", label: "Fire", number: "101" },
    { id: "5", label: "Mountain Rescue", number: "4411767" },
  ];

  const list = contacts.length ? contacts : defaultContacts;

  return (
    <div className={compact ? "" : "rounded-2xl border border-[#E05252]/25 bg-[var(--red-muted)] p-6 md:p-8"}>
      {!compact && (
        <>
          <h1 className="font-display text-3xl font-bold">Emergency panel</h1>
          <p className="mt-2 max-w-xl text-[15px] text-[var(--text-muted)]">
            Works offline after you download the Nepal pack. Tap to call instantly.
          </p>
        </>
      )}

      <button
        type="button"
        onClick={shareLocation}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--red)] py-4 text-[15px] font-bold text-white shadow-lg hover:opacity-90"
      >
        📍 Share my GPS location (SOS)
      </button>

      <ul className={`space-y-3 ${compact ? "mt-4" : "mt-8"}`}>
        {list.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[var(--bg-card)] px-4 py-3"
          >
            <div>
              <span className="text-[14px] font-medium">{c.label}</span>
              {c.description && (
                <p className="text-[11px] text-[var(--text-muted)]">{c.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[16px] font-semibold text-[var(--red)]">
                {c.number}
              </span>
              <button
                type="button"
                onClick={() => call(c.number)}
                className="rounded-lg bg-[var(--red)] px-3 py-1.5 text-[11px] font-bold text-white"
                aria-label={`Call ${c.label}`}
              >
                Call
              </button>
              <button
                type="button"
                onClick={() => copy(c.number, c.label)}
                className="rounded-lg border border-white/15 px-2 py-1.5 text-[11px]"
              >
                Copy
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
