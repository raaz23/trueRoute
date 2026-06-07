"use client";

import { qrRedirectUrl } from "@/lib/business/serialize";

export default function QrCodeDisplay({
  qrCode,
  businessName,
}: {
  qrCode: string;
  businessName: string;
}) {
  const url = qrRedirectUrl(qrCode);
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}`;

  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6 text-center">
      <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--gold)]">
        Scan QR Code
      </p>
      <p className="mt-1 text-[14px] text-[var(--text-muted)]">
        Instant access to {businessName}&apos;s trusted profile
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrImage}
        alt={`QR code for ${businessName}`}
        className="mx-auto mt-4 rounded-xl border border-white/10 bg-white p-2"
        width={240}
        height={240}
      />
      <p className="mt-3 break-all font-mono text-[11px] text-[var(--text-muted)]">{url}</p>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(url)}
        className="mt-3 rounded-xl border border-white/10 px-4 py-2 text-[12px] font-medium hover:bg-white/5"
      >
        Copy link
      </button>
    </div>
  );
}
