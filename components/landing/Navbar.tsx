"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Features",    href: "/features" },
  { label: "Fair Prices", href: "/#prices" },
  { label: "Cities",      href: "/#cities" },
  { label: "AI Guide",    href: "/features#ai" },
  { label: "Translate",   href: "/features#translate" },
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

          {/* CTA + mobile hamburger */}
          <div className="flex items-center gap-4">
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
            <div className="mt-2 pt-4 border-t border-white/8">
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
