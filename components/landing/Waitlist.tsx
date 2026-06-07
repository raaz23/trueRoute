"use client";
import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState("");

  const submit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        return;
      }
    } catch {
      /* offline queue */
    }
    const { isAppOnline } = await import("@/lib/network/connectivity");
    if (!(await isAppOnline())) {
      const key = "tr_waitlist_queue";
      const q = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
      q.push(email);
      localStorage.setItem(key, JSON.stringify(q));
      setSubmitted(true);
      return;
    }
    setError("Could not join waitlist. Try again.");
  };

  return (
    <section
      id="waitlist"
      className="py-28 px-6 topo-bg border-t border-white/5 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(212,160,23,0.07)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[600px] mx-auto text-center relative z-10">

        <div className="reveal section-tag mb-6">
          Free forever · No credit card · No guides needed
        </div>

        <h2 className="reveal font-display text-[46px] md:text-[58px] font-bold leading-tight mb-6">
          Start your honest<br />
          <span className="grad-gold">journey today.</span>
        </h2>

        <p className="reveal text-[16px] text-[var(--text-muted)] leading-relaxed mb-10 max-w-[460px] mx-auto">
          Join thousands of smart travelers who never overpay, never get lost, and always
          know the true story of every place they visit. Launch edition — Nepal.
        </p>

        {/* Trust icons */}
        <div className="reveal flex justify-center gap-8 mb-10 flex-wrap">
          {[
            { icon: "🔒", text: "No spam" },
            { icon: "✓",  text: "Free forever" },
            { icon: "🌍", text: "Works worldwide" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-[13px] text-[var(--text-muted)]">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {!submitted ? (
          <div className="reveal">
            <div className="flex gap-3 max-w-[440px] mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Enter your email address"
                className="flex-1 bg-[var(--bg-card)] border border-white/12 rounded-xl px-5 py-4 text-[14px] text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[rgba(212,160,23,0.5)] transition-colors duration-200"
              />
              <button
                onClick={submit}
                className="bg-gradient-to-r from-[#D4A017] to-[#A87C10] text-white text-[14px] font-bold px-6 py-4 rounded-xl hover:shadow-[0_12px_32px_rgba(212,160,23,0.4)] hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                Get Access →
              </button>
            </div>
            {error && (
              <p className="text-[12px] text-[var(--red)] mt-3">{error}</p>
            )}
            <p className="text-[12px] text-[var(--text-muted)] mt-4">
              We&apos;ll notify you the moment TrueRoute launches. Unsubscribe anytime.
            </p>
          </div>
        ) : (
          <div className="reveal bg-[var(--teal-muted)] border border-[var(--teal)]/25 rounded-2xl px-8 py-7">
            <div className="text-3xl mb-3">🎉</div>
            <div className="text-[18px] font-semibold text-[var(--teal)] mb-2">
              You&apos;re on the list!
            </div>
            <p className="text-[14px] text-[var(--text-muted)]">
              Welcome, smart traveler. We&apos;ll email you when TrueRoute launches in Nepal.
              No scams. No overcharging. Just honest travel.
            </p>
          </div>
        )}

        {/* Social proof */}
        <div className="reveal mt-14 pt-10 border-t border-white/6 grid grid-cols-3 gap-8">
          {[
            { n: "2,400+", l: "On the waitlist" },
            { n: "6",      l: "Cities at launch" },
            { n: "100%",   l: "Free forever"     },
          ].map(({ n, l }) => (
            <div key={l}>
              <div className="font-display text-[30px] font-bold text-[var(--gold)]">{n}</div>
              <div className="text-[12px] text-[var(--text-muted)] mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
