"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Fair prices", href: "/#prices" },
  { label: "Cities", href: "/cities" },
  { label: "How it works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 
          bg-[rgba(6,10,20,0.72)] backdrop-blur-xl border-b border-white/5
          ${
          scrolled
            ? "bg-[#060A14]/95 backdrop-blur-xl border-b border-white/5 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4A017] to-[#A87C10] flex items-center justify-center text-white font-bold text-base shadow-lg group-hover:shadow-[0_0_20px_rgba(212,160,23,0.4)] transition-shadow duration-300">
              🧭
            </div>
            <span className="font-display text-[22px] font-semibold tracking-tight text-[var(--text)]">
              True<span className="text-[var(--gold)]">Route</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Profile hub + auth + CTA + mobile hamburger */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/profile"
              title="Profile — account, saved places, notes, adventures, private essentials"
              aria-label="Open profile"
              className="hidden md:flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[var(--bg-card)] text-[var(--gold)] transition-colors hover:border-[var(--gold)]/40 hover:bg-[var(--gold-muted)]"
            >
              <UserRound className="h-5 w-5" strokeWidth={2} />
            </Link>
            <Link
              href="/login"
              className="hidden md:inline text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="hidden md:inline text-[13px] font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
            >
              Sign up
            </Link>
            <Link
              href="/#waitlist"
              className="hidden md:inline-flex bg-gradient-to-r from-[#D4A017] to-[#A87C10] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:shadow-[0_8px_24px_rgba(212,160,23,0.35)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Early Access — Free
            </Link>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-white/10"
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-[1.5px] bg-[var(--text)] block transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`w-5 h-[1.5px] bg-[var(--text)] block transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`w-5 h-[1.5px] bg-[var(--text)] block transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-[#060A14]/95 backdrop-blur-xl" onClick={() => setMenuOpen(false)} />
        <div
          className={`absolute top-[68px] left-4 right-4 bg-[#0C1528] border border-white/10 rounded-2xl p-6 transition-all duration-300 ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-left text-[15px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] py-3 px-4 rounded-xl hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 space-y-2 border-t border-white/8 pt-4">
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/12 py-3 px-4 text-center text-[15px] font-medium text-[var(--text)] hover:bg-white/5"
              >
                <UserRound className="h-5 w-5 text-[var(--gold)]" />
                Profile &amp; traveler hub
              </Link>
              <Link
                href="/map"
                onClick={() => setMenuOpen(false)}
                className="block cursor-pointer rounded-xl py-2.5 text-center text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                Map &amp; tools →
              </Link>
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-xl border border-white/15 py-3 text-center text-[14px] font-semibold text-[var(--text)]"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-xl border border-[var(--gold)]/40 py-3 text-center text-[14px] font-semibold text-[var(--gold)]"
                >
                  Sign up
                </Link>
              </div>
              <Link
                href="/#waitlist"
                onClick={() => setMenuOpen(false)}
                className="flex w-full justify-center bg-gradient-to-r from-[#D4A017] to-[#A87C10] text-white font-semibold py-3 rounded-xl"
              >
                Get Early Access — Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
