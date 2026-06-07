"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  const links: Record<string, { label: string; href: string }[]> = {
    Product: [
      { label: "Features", href: "/features" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Cities", href: "/cities" },
      { label: "FAQ", href: "/faq" },
      { label: "Profile", href: "/profile" },
      { label: "Map", href: "/map" },
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/signup" },
    ],
    Company: [
      { label: "Admin", href: "/admin" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
    Support: [
      { label: "Help Center", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Feedback", href: "#" },
      { label: "Report a Price", href: "#" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-white/6 px-6 pt-16 pb-10">
      <div className="max-w-[1120px] mx-auto">

        {/* Top row */}
        <div className="grid md:grid-cols-[280px_1fr] gap-14 mb-14">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4A017] to-[#A87C10] flex items-center justify-center text-base shadow-lg">
                🧭
              </div>
              <span className="font-display text-[22px] font-semibold">
                True<span className="text-[var(--gold)]">Route</span>
              </span>
            </div>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mb-5 max-w-[220px]">
              The honest travel companion. Real prices, real knowledge, real safety — for every tourist, everywhere.
            </p>
            <div className="text-[11px] text-[var(--text-muted)]">
              🇳🇵 Built for Nepal · Expanding globally
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold)] mb-4">
                  {category}
                </div>
                <ul className="flex flex-col gap-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      {item.href === "#" ? (
                        <span className="cursor-default text-[13px] text-[var(--text-muted)]">
                          {item.label}
                        </span>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-[13px] text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text)]"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="glow-divider mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[12px] text-[var(--text-muted)]">
            © {year} TrueRoute · The honest path forward · Nepal → World
          </div>

          <div className="flex items-center gap-6">
            <a href="#" onClick={(e) => e.preventDefault()} className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Terms</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Contact</a>
          </div>

          <div className="flex gap-3">
            {["𝕏", "in", "ig"].map((icon) => (
              <a
                key={icon}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-[12px] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-white/25 transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
