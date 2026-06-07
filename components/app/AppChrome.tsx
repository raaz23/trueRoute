"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import TravelStatusBar from "@/components/app/TravelStatusBar";
import GpsDangerBanner from "@/components/app/GpsDangerBanner";
import AppHeaderAuth from "@/components/app/AppHeaderAuth";
import FirstVisitBanner from "@/components/app/FirstVisitBanner";
import TouristQuickTips from "@/components/app/TouristQuickTips";

const links = [
  { href: "/map", label: "Map", icon: "🗺️" },
  { href: "/map/tourism", label: "3D Map", icon: "🌐" },
  { href: "/prices", label: "Prices", icon: "💰" },
  { href: "/chat", label: "AI Guide", icon: "💬" },
  { href: "/translate", label: "Translate", icon: "🌐" },
  { href: "/emergency", label: "Emergency", icon: "🆘" },
  { href: "/places", label: "Places", icon: "📍" },
  { href: "/business", label: "Businesses", icon: "🏪" },
  { href: "/submit-price", label: "Submit", icon: "➕" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function AppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 md:pb-8">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(6,10,20,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4A017] to-[#A87C10] text-sm shadow-lg">
              🧭
            </span>
            True<span className="text-[var(--gold)]">Route</span>
          </Link>
          <span className="hidden text-[11px] font-medium uppercase tracking-widest text-[var(--text-muted)] sm:inline">
            Nepal launch
          </span>
          <AppHeaderAuth />
        </div>
      </header>

      <div className="mx-auto flex max-w-[1120px] gap-6 px-4 pt-6 md:px-6">
        <aside className="hidden w-48 shrink-0 md:block">
          <nav className="sticky top-24 space-y-1">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors ${
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
        </aside>

        <div className="min-w-0 flex-1">
          <TravelStatusBar />
          <GpsDangerBanner />
          <FirstVisitBanner />
          <TouristQuickTips />
          {children}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/8 bg-[#060A14]/95 backdrop-blur-xl md:hidden">
        <div className="flex justify-around overflow-x-auto px-1 py-2">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex min-w-[52px] flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px] font-medium ${
                  active ? "text-[var(--gold)]" : "text-[var(--text-muted)]"
                }`}
              >
                <span className="text-lg">{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
