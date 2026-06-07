"use client";

import Link from "next/link";
import { motion } from "motion/react";

const services = [
  {
    href: "/prices",
    icon: "💰",
    title: "Fair Prices",
    desc: "Real NPR rates — show drivers before you pay",
    color: "from-[#D4A017]/20 to-transparent",
    border: "border-[var(--gold)]/30",
  },
  {
    href: "/map",
    icon: "🗺️",
    title: "Live Map",
    desc: "Stadia map — search, directions & near me",
    color: "from-[#6B8FD4]/20 to-transparent",
    border: "border-[#6B8FD4]/30",
  },
  {
    href: "/chat",
    icon: "💬",
    title: "AI Guide",
    desc: "Ask routes, scams, food — 24/7 answers",
    color: "from-[var(--teal)]/20 to-transparent",
    border: "border-[var(--teal)]/30",
  },
  {
    href: "/translate",
    icon: "🌐",
    title: "Translate",
    desc: "Nepali, Hindi & 12+ languages",
    color: "from-[#A855F7]/20 to-transparent",
    border: "border-[#A855F7]/30",
  },
  {
    href: "/emergency",
    icon: "🆘",
    title: "Emergency",
    desc: "Police, ambulance, tourist police — one tap",
    color: "from-[var(--red)]/20 to-transparent",
    border: "border-[var(--red)]/30",
  },
  {
    href: "/places",
    icon: "📍",
    title: "Places",
    desc: "Temples, lakes, trails with real stories",
    color: "from-[var(--gold)]/15 to-transparent",
    border: "border-white/10",
  },
  {
    href: "/business",
    icon: "🏪",
    title: "Businesses",
    desc: "Verified hotels, tours, shops — honest reviews & QR profiles",
    color: "from-[#6B8FD4]/20 to-transparent",
    border: "border-[#6B8FD4]/30",
  },
  {
    href: "/submit-price",
    icon: "➕",
    title: "Submit Price",
    desc: "Help the community — report what you paid",
    color: "from-[var(--teal)]/15 to-transparent",
    border: "border-white/10",
  },
  {
    href: "/profile",
    icon: "👤",
    title: "Profile & Offline",
    desc: "Download pack — works without internet",
    color: "from-white/5 to-transparent",
    border: "border-white/10",
  },
];

export default function ServiceHub() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.div
        className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(212,160,23,0.12)_0%,transparent_70%)]"
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(15,157,141,0.08)_0%,transparent_70%)]"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="relative z-10 border-b border-white/8 bg-[rgba(6,10,20,0.85)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4A017] to-[#A87C10] text-lg shadow-lg">
              🧭
            </span>
            True<span className="text-[var(--gold)]">Route</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/about" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text)]">
              About
            </Link>
            <Link href="/faq" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text)]">
              FAQ
            </Link>
            <Link href="/login" className="text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text)]">
              Log in
            </Link>
            <Link
              href="/map"
              className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(212,160,23,0.35)]"
            >
              Open app →
            </Link>
          </nav>
          <Link
            href="/map"
            className="md:hidden rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-4 py-2 text-[13px] font-semibold text-white"
          >
            Open app
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-[1120px] px-4 pb-20 pt-12 md:px-6 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/25 bg-[var(--gold-muted)] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-[var(--gold)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--gold)]" />
            Live in Nepal · Real tools, not a brochure
          </p>
          <h1 className="font-display text-[40px] font-bold leading-[1.05] tracking-tight md:text-[56px]">
            Travel Nepal with
            <br />
            <span className="grad-gold">honest prices & real help</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-[16px] leading-relaxed text-[var(--text-muted)]">
            TrueRoute is a working travel service — fair price database, AI guide, maps,
            translation, and emergency tools. Tap a service below and use it now.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/map"
              className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-8 py-4 text-[15px] font-semibold text-white shadow-[0_12px_32px_rgba(212,160,23,0.4)] transition hover:-translate-y-0.5"
            >
              Start exploring →
            </Link>
            <Link
              href="/prices"
              className="rounded-xl border border-white/15 px-8 py-4 text-[15px] font-medium transition hover:bg-white/5"
            >
              Check fair prices
            </Link>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <motion.div
              key={s.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.45 }}
            >
              <Link
                href={s.href}
                className={`group flex h-full flex-col rounded-2xl border bg-gradient-to-br ${s.color} ${s.border} p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]`}
              >
                <span className="text-3xl transition group-hover:scale-110">{s.icon}</span>
                <h2 className="mt-4 font-display text-[20px] font-semibold">{s.title}</h2>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[var(--text-muted)]">
                  {s.desc}
                </p>
                <span className="mt-4 text-[13px] font-semibold text-[var(--gold)] group-hover:underline">
                  Open →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid gap-6 rounded-2xl border border-white/8 bg-[var(--bg-card)] p-6 md:grid-cols-3 md:p-8"
        >
          {[
            { n: "6+", l: "Cities covered" },
            { n: "100%", l: "Free for tourists" },
            { n: "Offline", l: "Works without data" },
          ].map((stat) => (
            <div key={stat.l} className="text-center">
              <motion.div className="font-display text-[32px] font-bold text-[var(--gold)]">
                {stat.n}
              </motion.div>
              <p className="text-[13px] text-[var(--text-muted)]">{stat.l}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/8 py-8 text-center text-[13px] text-[var(--text-muted)]">
        <p>Built in Birgunj, Nepal · TrueRoute © {new Date().getFullYear()}</p>
        <p className="mt-2">
          <Link href="/about" className="hover:text-[var(--gold)]">
            About
          </Link>
          {" · "}
          <Link href="/admin/login" className="hover:text-[var(--text-mid)]">
            Admin
          </Link>
        </p>
      </footer>
    </div>
  );
}
