"use client";

import { useState } from "react";

export default function InquiryForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [inquiryType, setInquiryType] = useState("GENERAL");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`/api/businesses/${slug}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, inquiryType }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="rounded-xl bg-[var(--teal)]/15 p-4 text-[14px] text-[var(--teal)]">
        Inquiry sent! The business will contact you soon.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5">
      <h3 className="font-display text-lg font-semibold">Contact / Book</h3>

      <select
        value={inquiryType}
        onChange={(e) => setInquiryType(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
      >
        <option value="GENERAL">General inquiry</option>
        <option value="BOOKING">Booking request</option>
        <option value="QUOTE">Price quote</option>
      </select>

      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone / WhatsApp"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px]"
      />
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message..."
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[14px]"
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-[var(--teal)] py-2.5 text-[14px] font-semibold text-white disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send inquiry"}
      </button>
    </form>
  );
}
