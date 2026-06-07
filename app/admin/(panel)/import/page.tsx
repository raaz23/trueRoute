"use client";

import { useState } from "react";

const SAMPLE = `serviceName,city,category,touristPrice,fairPrice,routeFrom,routeTo,tip
Taxi Airport to Thamel,Kathmandu,TRANSPORT,800,450,Airport,Thamel,Insist on meter
Rickshaw 2km,Kathmandu,TRANSPORT,400,100,Thamel,Asan,Agree before ride
Dal Bhat meal,Kathmandu,FOOD,600,200,Thamel,,Eat where locals eat`;

export default function AdminImportPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  const runImport = async (body: FormData) => {
    setLoading(true);
    setError("");
    setResult(null);
    const res = await fetch("/api/admin/import", { method: "POST", body });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Import failed");
      return;
    }
    setResult(data);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    void runImport(fd);
  };

  const onPaste = () => {
    const fd = new FormData();
    fd.append("text", text);
    void runImport(fd);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">AI data import</h1>
        <p className="mt-2 text-[14px] text-[var(--text-muted)]">
          Upload <strong>.csv</strong> or <strong>.txt</strong> with cities, places, prices,
          emergency numbers, or phrases. AI analyzes the file and updates the database. Tourists
          see changes after refreshing or re-downloading the offline pack.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
        <label className="block text-[13px] font-medium">
          Upload file
          <input
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            onChange={onFile}
            disabled={loading}
            className="mt-2 block w-full text-[14px] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--gold-muted)] file:px-4 file:py-2 file:text-[var(--gold)]"
          />
        </label>

        <p className="text-center text-[12px] text-[var(--text-muted)]">— or paste below —</p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          placeholder="Paste CSV or free-form text with locations, prices, etc."
          className="w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 font-mono text-[13px] outline-none focus:ring-2 focus:ring-[var(--gold)]/40"
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onPaste}
            disabled={loading || !text.trim()}
            className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-6 py-3 text-[14px] font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Analyzing…" : "Analyze & import"}
          </button>
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            className="rounded-xl border border-white/15 px-4 py-3 text-[13px]"
          >
            Load sample CSV
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--teal)]/30 bg-[var(--teal-muted)]/30 p-4 text-[13px] text-[var(--text-muted)]">
        <p className="font-semibold text-[var(--teal)]">CSV columns (without Gemini)</p>
        <p className="mt-1 font-mono text-[12px]">
          serviceName, city, category, touristPrice, fairPrice, routeFrom, routeTo, tip
        </p>
        <p className="mt-2">
          Add <code className="text-[var(--gold)]">GOOGLE_GEMINI_API_KEY</code> for free-form text.
        </p>
      </div>

      {error && <p className="text-[14px] text-[var(--red)]">{error}</p>}

      {result && (
        <pre className="overflow-auto rounded-xl border border-white/10 bg-[var(--bg)] p-4 text-[12px] text-[var(--teal)]">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
