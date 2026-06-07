"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "user" | "ai"; text: string };

const starterMessages: Message[] = [
  {
    role: "user",
    text: "Best route from Thamel to Pashupatinath?",
  },
  {
    role: "ai",
    text: "Ask me anything — this preview uses the same TrueRoute AI as the live app when you are online.",
  },
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    setError(null);
    const userMessages = [...messages, { role: "user" as const, text }];
    setMessages(userMessages);
    setTyping(true);

    try {
      const apiMessages = userMessages.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          cityContext: "Kathmandu",
        }),
      });
      const data = await res.json();
      const reply =
        data.response ??
        data.message?.content ??
        "Sorry, I could not respond. Open the full AI guide in the app.";
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch {
      setError("Could not reach AI. Try the full guide in the app.");
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "I could not connect right now. Open **AI Guide** in the app for full answers with fair NPR prices.",
        },
      ]);
    }
    setTyping(false);
  };

  return (
    <section
      id="ai"
      className="border-t px-6 py-24"
      style={{
        borderColor: "rgba(15,157,141,0.1)",
        background: "rgba(15,157,141,0.025)",
      }}
    >
      <div className="mx-auto grid max-w-[1120px] items-center gap-14 md:grid-cols-2">
        <div className="reveal">
          <div
            className="section-tag mb-5"
            style={{
              background: "rgba(15,157,141,0.1)",
              borderColor: "rgba(15,157,141,0.25)",
              color: "var(--teal)",
            }}
          >
            <span className="inline-block h-[5px] w-[5px] rounded-full bg-[var(--teal)]" />
            AI Travel Guide · 24/7
          </div>
          <h2 className="mb-5 font-display text-[42px] font-bold leading-tight md:text-[50px]">
            Your local expert.
            <br />
            Always available.
          </h2>
          <p className="mb-8 text-[16px] leading-relaxed text-[var(--text-muted)]">
            Ask anything — routes, history, food, safety, fair prices. TrueRoute AI uses your
            verified Nepal price database (Gemini or Groq when configured).
          </p>

          <Link
            href="/chat"
            className="inline-flex rounded-xl bg-[var(--teal)] px-6 py-3 text-[14px] font-semibold text-white hover:opacity-90"
          >
            Open full AI guide →
          </Link>
        </div>

        <div className="reveal reveal-delay-2">
          <div
            className="overflow-hidden rounded-2xl border bg-[var(--bg-card)] shadow-[0_24px_64px_rgba(0,0,0,0.4)]"
            style={{ borderColor: "rgba(15,157,141,0.2)" }}
          >
            <div
              className="flex items-center gap-3 border-b px-5 py-4"
              style={{
                borderColor: "rgba(15,157,141,0.1)",
                background: "rgba(15,157,141,0.05)",
              }}
            >
              <div className="anim-dot h-2 w-2 rounded-full bg-[var(--teal)]" />
              <span className="text-[13px] font-semibold">TrueRoute AI Guide</span>
              <span className="ml-auto text-[11px] text-[var(--teal)]">Live preview</span>
            </div>

            <div
              ref={chatContainerRef}
              className="flex h-[340px] flex-col gap-3 overflow-y-auto scroll-smooth p-4"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div className="mr-2 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--teal)]/20 text-sm">
                      🧭
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-tr-sm border border-[rgba(212,160,23,0.2)] bg-[rgba(212,160,23,0.13)]"
                        : "rounded-tl-sm border border-white/8 bg-white/5 text-[var(--text-mid)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--teal)]/20 text-sm">
                    🧭
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-white/8 bg-white/5 px-4 py-3 text-[12px] text-[var(--text-muted)]">
                    Thinking…
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 border-t border-white/6 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask anything about Nepal..."
                className="flex-1 rounded-xl border border-white/8 bg-white/5 px-4 py-2.5 text-[13px] text-[var(--text)] outline-none transition-colors duration-200 placeholder:text-[var(--text-muted)] focus:border-[var(--teal)]/40"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || typing}
                className="rounded-xl bg-[var(--teal)] px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40"
              >
                Ask →
              </button>
            </div>
          </div>
          {error && (
            <p className="mt-2 text-center text-[11px] text-red-300">{error}</p>
          )}
          <p className="mt-3 text-center text-[11px] text-[var(--text-muted)]">
            Powered by TrueRoute `/api/chat` — Gemini → Groq → offline fair-price data.
          </p>
        </div>
      </div>
    </section>
  );
}
