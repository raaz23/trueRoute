"use client";

import { useState, useRef, useEffect } from "react";
import { useOfflineBundle } from "@/hooks/useOfflineBundle";
import { offlineChatReply } from "@/lib/offline/chat-offline";
import { getChatHistory, saveChatHistory } from "@/lib/offline/local";
import { sessionHeaders } from "@/hooks/useSessionId";
import type { ChatMessage } from "@/lib/offline/types";

const suggestions = [
  "Fair price: Thamel to Patan rickshaw?",
  "How to visit Boudhanath without scams?",
  "What is fair Dal Bhat price in Thamel?",
];

const CITIES = ["Kathmandu", "Pokhara", "Chitwan", "Lumbini", "Bhaktapur"] as const;

type AiProvider = "gemini" | "groq" | "offline";

function providerLabel(p: AiProvider | null): string {
  switch (p) {
    case "gemini":
      return "Gemini AI + TrueRoute data";
    case "groq":
      return "Groq AI + TrueRoute data";
    case "offline":
      return "Offline pack (add GOOGLE_GEMINI_API_KEY for live AI)";
    default:
      return "Connecting…";
  }
}

export default function ChatPage() {
  const { bundle, online } = useOfflineBundle();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState<string>("Kathmandu");
  const [lastProvider, setLastProvider] = useState<AiProvider | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(getChatHistory());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const persist = (next: ChatMessage[]) => {
    setMessages(next);
    saveChatHistory(next);
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = {
      role: "user",
      content: text.trim(),
      at: new Date().toISOString(),
    };
    const next = [...messages, userMsg];
    persist(next);
    setInput("");
    setLoading(true);

    if (!online && bundle) {
      const reply = offlineChatReply(text, bundle);
      setLastProvider("offline");
      persist([
        ...next,
        { role: "assistant", content: reply, at: new Date().toISOString() },
      ]);
      setLoading(false);
      return;
    }

    if (!online && !bundle) {
      persist([
        ...next,
        {
          role: "assistant",
          content:
            "Download the offline pack from Profile while on WiFi — then I can answer using fair prices and places without internet.",
          at: new Date().toISOString(),
        },
      ]);
      setLastProvider("offline");
      setLoading(false);
      return;
    }

    const apiMessages = next.map((m) => ({ role: m.role, content: m.content }));
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...sessionHeaders() },
        body: JSON.stringify({
          messages: apiMessages,
          cityContext: city,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Chat failed");
      }
      const content =
        data.response ??
        data.message?.content ??
        (bundle ? offlineChatReply(text, bundle) : "Sorry, I could not respond.");
      if (data.provider) setLastProvider(data.provider as AiProvider);
      persist([
        ...next,
        { role: "assistant", content, at: new Date().toISOString() },
      ]);
    } catch {
      const fallback = bundle
        ? offlineChatReply(text, bundle)
        : "Connection error. Try offline pack from Profile.";
      setLastProvider("offline");
      persist([
        ...next,
        { role: "assistant", content: fallback, at: new Date().toISOString() },
      ]);
    }
    setLoading(false);
  };

  const clearChat = () => {
    persist([]);
    setLastProvider(null);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl border border-white/10 bg-[var(--bg-card)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-4 md:px-6">
        <div>
          <h1 className="font-display text-2xl font-bold">AI travel guide</h1>
          <p className="text-[12px] text-[var(--text-muted)]">
            {online ? providerLabel(lastProvider) : bundle ? "Offline — smart answers from your pack" : "Offline — limited"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="chat-city">
            City context
          </label>
          <select
            id="chat-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-lg border border-white/10 bg-[var(--bg)] px-2 py-1.5 text-[12px] text-white"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={clearChat}
            className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            New chat
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-[14px] text-[var(--text-muted)]">Try asking:</p>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="block w-full rounded-xl border border-white/10 px-4 py-3 text-left text-[13px] hover:border-[var(--gold)]/40"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[90%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-[var(--gold-muted)]"
                : "mr-auto border border-white/8 bg-[var(--bg)]"
            }`}
          >
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
        {loading && <p className="text-[13px] text-[var(--text-muted)]">Thinking…</p>}
        <div ref={bottomRef} />
      </div>

      <form
        className="flex gap-2 border-t border-white/8 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about routes, prices, places…"
          className="flex-1 rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none focus:border-[var(--teal)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
