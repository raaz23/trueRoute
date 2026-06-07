"use client";

import { useMemo, useState } from "react";
import { useOfflineBundle } from "@/hooks/useOfflineBundle";
import { sessionHeaders } from "@/hooks/useSessionId";
import { queueTranslation } from "@/lib/offline/local";

export default function TranslatePage() {
  const { bundle, online } = useOfflineBundle();
  const phrases = bundle?.phrases ?? [];
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!cat) return phrases;
    return phrases.filter((p) => p.category === cat);
  }, [phrases, cat]);

  const categories = useMemo(
    () => [...new Set(phrases.map((p) => p.category))],
    [phrases]
  );

  const translate = async () => {
    if (!text.trim()) return;
    if (!online) {
      setResult("Custom translation needs internet. Use quick phrases below — they work offline.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...sessionHeaders() },
      body: JSON.stringify({ text, source: "en", target: "ne" }),
    });
    const data = await res.json();
    const translated = data.translated ?? data.translatedText ?? text;
    setResult(translated);
    setLoading(false);
  };

  const copy = (s: string) => navigator.clipboard?.writeText(s);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Language bridge</h1>
        <p className="mt-1 text-[14px] text-[var(--text-muted)]">
          Phrases work offline · live translation when online
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Type in English…"
          className="w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none"
        />
        <button
          type="button"
          onClick={translate}
          disabled={loading}
          className="mt-3 rounded-xl bg-[var(--teal)] px-5 py-2.5 text-[13px] font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Translating…" : online ? "Translate to Nepali" : "Offline — use phrases"}
        </button>
        {result && (
          <p className="mt-4 rounded-xl bg-[var(--teal-muted)] p-4 text-[16px] text-[var(--teal)]">
            {result}
            <button type="button" onClick={() => copy(result)} className="ml-3 text-[12px] underline">
              Copy
            </button>
          </p>
        )}
      </div>

      <div>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCat(null)}
            className={`rounded-full px-3 py-1 text-[12px] ${!cat ? "bg-[var(--gold-muted)] text-[var(--gold)]" : "border border-white/10"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-full px-3 py-1 text-[12px] ${cat === c ? "bg-[var(--gold-muted)] text-[var(--gold)]" : "border border-white/10"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--gold)]">
                {p.category}
              </span>
              <p className="mt-2 text-[14px]">{p.english}</p>
              <p className="mt-1 text-[15px] font-medium text-[var(--teal)]">{p.nepali}</p>
              <button
                type="button"
                onClick={() => copy(p.nepali)}
                className="mt-2 text-[11px] text-[var(--text-muted)] hover:text-[var(--gold)]"
              >
                Copy Nepali →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
