"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BusinessCard, { type BusinessCardData } from "@/components/business/BusinessCard";
import BusinessCompare from "@/components/business/BusinessCompare";
import { BUSINESS_CATEGORIES } from "@/lib/business/constants";

type City = { id: string; name: string; slug: string };

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export default function BusinessDiscovery() {
  const [businesses, setBusinesses] = useState<BusinessCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [compare, setCompare] = useState<BusinessCardData[]>([]);
  const [nearbyMode, setNearbyMode] = useState(false);
  const [geoError, setGeoError] = useState("");

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [minRating, setMinRating] = useState("");
  const [minTrust, setMinTrust] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("trust");

  const debouncedQ = useDebounce(q, 350);

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then(setCities)
      .catch(() => {});
  }, []);

  const load = useCallback(async (lat?: number, lng?: number) => {
    setLoading(true);
    setGeoError("");

    if (nearbyMode && lat != null && lng != null) {
      const params = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        radius: "15",
      });
      if (category) params.set("category", category);
      const res = await fetch(`/api/businesses/nearby?${params}`);
      const data = await res.json();
      setBusinesses(
        Array.isArray(data)
          ? data.map((b: BusinessCardData & { distanceKm: number }) => ({
              ...b,
              distanceKm: b.distanceKm,
            }))
          : []
      );
      setLoading(false);
      return;
    }

    const params = new URLSearchParams();
    if (debouncedQ) params.set("q", debouncedQ);
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    if (verifiedOnly) params.set("verified", "true");
    if (featuredOnly) params.set("featured", "true");
    if (minRating) params.set("minRating", minRating);
    if (minTrust) params.set("minTrust", minTrust);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);

    const res = await fetch(`/api/businesses?${params}`);
    const data = await res.json();
    setBusinesses(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [
    debouncedQ,
    category,
    city,
    verifiedOnly,
    featuredOnly,
    minRating,
    minTrust,
    maxPrice,
    sort,
    nearbyMode,
  ]);

  useEffect(() => {
    if (nearbyMode) {
      if (!navigator.geolocation) {
        setGeoError("Geolocation not supported");
        setNearbyMode(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => load(pos.coords.latitude, pos.coords.longitude),
        () => {
          setGeoError("Enable location to find nearby businesses");
          setNearbyMode(false);
        }
      );
    } else {
      load();
    }
  }, [load, nearbyMode]);

  const toggleCompare = (b: BusinessCardData) => {
    setCompare((prev) => {
      if (prev.some((x) => x.slug === b.slug)) {
        return prev.filter((x) => x.slug !== b.slug);
      }
      if (prev.length >= 3) return prev;
      return [...prev, b];
    });
  };

  const compareSlugs = useMemo(() => new Set(compare.map((c) => c.slug)), [compare]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[var(--gold-muted)] to-transparent p-6 md:p-8">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--gold)]">
          Trusted Tourism Marketplace
        </p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Discover verified businesses
        </h1>
        <p className="mt-2 max-w-xl text-[15px] text-[var(--text-muted)]">
          Filter by trust, price, and ratings — compare side-by-side without leaving TrueRoute.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/business/register"
            className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-6 py-2.5 text-[14px] font-semibold text-white"
          >
            List your business
          </Link>
          <Link
            href="/business/dashboard"
            className="rounded-xl border border-white/15 px-6 py-2.5 text-[14px] font-medium hover:bg-white/5"
          >
            Business dashboard
          </Link>
          <Link
            href="/map/tourism"
            className="rounded-xl border border-[#6B8FD4]/40 px-6 py-2.5 text-[14px] font-medium text-[#6B8FD4] hover:bg-[#6B8FD4]/10"
          >
            Tourism map (3D) →
          </Link>
          <Link
            href="/map"
            className="rounded-xl border border-white/15 px-6 py-2.5 text-[14px] font-medium hover:bg-white/5"
          >
            Standard map
          </Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search businesses..."
          className="rounded-xl border border-white/10 bg-[var(--bg-card)] px-4 py-3 text-[14px] lg:col-span-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-white/10 bg-[var(--bg-card)] px-4 py-3 text-[14px]"
        >
          <option value="">All categories</option>
          {BUSINESS_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.icon} {c.label}
            </option>
          ))}
        </select>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={nearbyMode}
          className="rounded-xl border border-white/10 bg-[var(--bg-card)] px-4 py-3 text-[14px] disabled:opacity-50"
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="rounded-xl border border-white/10 bg-[var(--bg-card)] px-3 py-2 text-[13px]"
        >
          <option value="">Any rating</option>
          {[4, 3, 2].map((n) => (
            <option key={n} value={n}>
              {n}+ stars
            </option>
          ))}
        </select>
        <select
          value={minTrust}
          onChange={(e) => setMinTrust(e.target.value)}
          className="rounded-xl border border-white/10 bg-[var(--bg-card)] px-3 py-2 text-[13px]"
        >
          <option value="">Any trust</option>
          {[90, 80, 70].map((n) => (
            <option key={n} value={n}>
              Trust {n}%+
            </option>
          ))}
        </select>
        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="rounded-xl border border-white/10 bg-[var(--bg-card)] px-3 py-2 text-[13px]"
        >
          <option value="">Any price</option>
          <option value="3000">Under NPR 3,000</option>
          <option value="5000">Under NPR 5,000</option>
          <option value="15000">Under NPR 15,000</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-white/10 bg-[var(--bg-card)] px-3 py-2 text-[13px]"
        >
          <option value="trust">Sort: Trust</option>
          <option value="rating">Sort: Rating</option>
          <option value="price">Sort: Price</option>
          <option value="popular">Sort: Popular</option>
        </select>
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[var(--bg-card)] px-3 py-2 text-[13px]">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
          />
          Verified only
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[var(--bg-card)] px-3 py-2 text-[13px]">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => setFeaturedOnly(e.target.checked)}
          />
          Featured
        </label>
        <button
          type="button"
          onClick={() => setNearbyMode((v) => !v)}
          className={`rounded-xl px-3 py-2 text-[13px] font-medium ${
            nearbyMode
              ? "bg-[var(--teal)] text-white"
              : "border border-white/10 bg-[var(--bg-card)]"
          }`}
        >
          📍 Near me
        </button>
      </div>

      {geoError && <p className="text-[13px] text-[var(--red)]">{geoError}</p>}

      <BusinessCompare
        selected={compare}
        onRemove={(slug) => setCompare((p) => p.filter((b) => b.slug !== slug))}
        onClear={() => setCompare([])}
      />

      {loading ? (
        <p className="text-center text-[var(--text-muted)]">Loading businesses...</p>
      ) : businesses.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-12 text-center">
          <p className="text-[var(--text-muted)]">No businesses match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((b) => (
            <div key={b.slug} className="relative">
              <BusinessCard business={b} />
              <button
                type="button"
                onClick={() => toggleCompare(b)}
                className={`absolute right-3 top-3 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                  compareSlugs.has(b.slug)
                    ? "bg-[var(--gold)] text-black"
                    : "bg-black/60 text-white"
                }`}
              >
                {compareSlugs.has(b.slug) ? "Comparing" : "Compare"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
