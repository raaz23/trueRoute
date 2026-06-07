"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BusinessProfileView from "@/components/business/BusinessProfileView";

export default function BusinessProfilePage() {
  const params = useParams();
  const slug = String(params.slug ?? "");
  const [business, setBusiness] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/businesses/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then(setBusiness)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <p className="text-[var(--text-muted)]">Loading profile...</p>;
  }

  if (error || !business) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-8 text-center">
        <p className="text-[var(--text-muted)]">Business not found.</p>
        <Link href="/business" className="mt-4 inline-block text-[var(--gold)] hover:underline">
          ← Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/business" className="text-[13px] font-medium text-[var(--gold)] hover:underline">
        ← All businesses
      </Link>
      <div className="mt-4">
        <BusinessProfileView business={business as never} />
      </div>
    </div>
  );
}
