"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/cities", label: "Cities", icon: "🏙️" },
  { href: "/admin/places", label: "Places", icon: "📍" },
  { href: "/admin/moderation", label: "Marketplace", icon: "🏪" },
  { href: "/admin/businesses", label: "Businesses", icon: "🏬" },
  { href: "/admin/reviews", label: "Reviews", icon: "⭐" },
  { href: "/admin/reports", label: "Scam Reports", icon: "🚩" },
  { href: "/admin/documents", label: "KYC Docs", icon: "📄" },
  { href: "/admin/prices", label: "Fair Prices", icon: "💰" },
  { href: "/admin/submissions", label: "Submissions", icon: "📥" },
  { href: "/admin/import", label: "AI Import", icon: "🤖" },
  { href: "/admin/faq", label: "FAQ", icon: "❓" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "⭐" },
  { href: "/admin/photos", label: "Gallery", icon: "🖼️" },
  { href: "/admin/emergency", label: "Emergency", icon: "🚨" },
  { href: "/admin/phrases", label: "Phrases", icon: "🗣️" },
  { href: "/admin/settings", label: "Site Text", icon: "⚙️" },
  { href: "/admin/waitlist", label: "Waitlist", icon: "✉️" },
  { href: "/admin/feedback", label: "Feedback", icon: "💬" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/8 bg-[var(--bg-card)]">
      <div className="border-b border-white/8 px-5 py-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4A017] to-[#A87C10] text-lg">
            🧭
          </span>
          <div>
            <div className="font-display text-lg font-bold leading-tight">
              True<span className="text-[var(--gold)]">Route</span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Admin
            </span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {links.map((l) => {
          const active =
            pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                active
                  ? "bg-[var(--gold-muted)] text-[var(--gold)]"
                  : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text)]"
              }`}
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 border-t border-white/8 p-3">
        <Link
          href="/"
          target="_blank"
          className="block rounded-xl px-3 py-2 text-center text-[12px] text-[var(--text-muted)] hover:bg-white/5"
        >
          View website ↗
        </Link>
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-xl border border-white/10 py-2 text-[12px] font-semibold text-[var(--red)] hover:bg-[var(--red-muted)]"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
