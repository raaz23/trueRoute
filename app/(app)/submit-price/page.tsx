"use client";

import { useState } from "react";
import { useOfflineBundle } from "@/hooks/useOfflineBundle";
import { queueSubmission } from "@/lib/offline/local";
import { flushPendingSubmissions } from "@/lib/offline/sync";

export default function SubmitPricePage() {
  const { bundle, online } = useOfflineBundle();
  const [cityId, setCityId] = useState("");
  const [category, setCategory] = useState("TRANSPORT");
  const [serviceName, setServiceName] = useState("");
  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [pricePaid, setPricePaid] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityId || !serviceName || !pricePaid) {
      setMsg("Fill required fields.");
      return;
    }
    const payload = {
      cityId,
      category,
      serviceName,
      routeFrom: routeFrom || undefined,
      routeTo: routeTo || undefined,
      pricePaid: Number(pricePaid),
      notes: notes || undefined,
    };

    if (online) {
      const res = await fetch("/api/prices/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMsg("Submitted for admin review. Thank you!");
        setServiceName("");
        setPricePaid("");
        return;
      }
    }

    queueSubmission(payload);
    setMsg("Saved on your phone — will upload when you are back online.");
    if (online) await flushPendingSubmissions();
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Submit a price</h1>
        <p className="mt-1 text-[14px] text-[var(--text-muted)]">
          Help other travelers — works offline (queued until online).
        </p>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
        <label className="block text-[12px]">
          City
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-3 py-2"
            required
          >
            <option value="">Select city</option>
            {bundle?.cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[12px]">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-3 py-2"
          >
            {["TRANSPORT", "FOOD", "ACCOMMODATION", "ATTRACTION", "SHOPPING"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[12px]">
          Service name
          <input
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-3 py-2"
            placeholder="Rickshaw, Dal Bhat…"
            required
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-[12px]">
            From
            <input
              value={routeFrom}
              onChange={(e) => setRouteFrom(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-3 py-2"
            />
          </label>
          <label className="block text-[12px]">
            To
            <input
              value={routeTo}
              onChange={(e) => setRouteTo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-3 py-2"
            />
          </label>
        </div>
        <label className="block text-[12px]">
          Price you paid (NPR)
          <input
            type="number"
            value={pricePaid}
            onChange={(e) => setPricePaid(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-3 py-2"
            required
          />
        </label>
        <label className="block text-[12px]">
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-3 py-2"
          />
        </label>
        {msg && <p className="text-[13px] text-[var(--teal)]">{msg}</p>}
        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--teal)] py-3 font-semibold text-white"
        >
          Submit price
        </button>
      </form>
    </div>
  );
}
