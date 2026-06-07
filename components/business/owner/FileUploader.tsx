"use client";

import { useState } from "react";

export default function FileUploader({
  slug,
  ownerEmail,
  kind,
  album,
  onUploaded,
}: {
  slug: string;
  ownerEmail: string;
  kind: "media" | "document";
  album?: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("slug", slug);
      form.append("ownerEmail", ownerEmail);
      form.append("kind", kind);
      form.append("file", file);

      const res = await fetch("/api/business/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      if (kind === "media" && album) {
        await fetch(`/api/business/owner/${slug}/media`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ownerEmail,
            url: data.url,
            album,
            caption: file.name,
          }),
        });
      }

      onUploaded(data.url);
      if (data.storage === "supabase") {
        setError("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-center hover:border-[var(--gold)]/40">
        <span className="text-2xl">{kind === "document" ? "📄" : "📷"}</span>
        <span className="mt-2 text-[13px] font-medium">
          {uploading ? "Uploading…" : `Upload ${kind === "document" ? "document" : "image"}`}
        </span>
        <span className="mt-1 text-[11px] text-[var(--text-muted)]">
          {kind === "document" ? "PDF or image, max 10MB → Supabase Storage" : "JPEG/PNG/WebP, max 5MB → Supabase Storage"}
        </span>
        <input
          type="file"
          className="hidden"
          accept={kind === "document" ? "image/*,application/pdf" : "image/*"}
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
        />
      </label>
      {error && <p className="mt-2 text-[12px] text-[var(--red)]">{error}</p>}
    </div>
  );
}
