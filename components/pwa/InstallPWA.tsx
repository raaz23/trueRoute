"use client";

import { useEffect, useState } from "react";
import { dismissInstallPrompt, isInstallDismissed } from "@/lib/offline/local";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPWA() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isInstallDismissed()) return;
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setVisible(false);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (installed || !visible || !deferred) return null;

  const install = async () => {
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferred(null);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[90] md:bottom-6 md:left-auto md:right-6 md:max-w-sm">
      <div className="rounded-2xl border border-[var(--gold)]/35 bg-[var(--bg-card)] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <p className="font-display text-[16px] font-bold">Install TrueRoute</p>
        <p className="mt-1 text-[12px] text-[var(--text-muted)]">
          Add to home screen — works offline with fair prices & emergency numbers.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={install}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] py-2.5 text-[13px] font-semibold text-white"
          >
            Install app
          </button>
          <button
            type="button"
            onClick={() => {
              dismissInstallPrompt();
              setVisible(false);
            }}
            className="rounded-xl border border-white/15 px-3 text-[12px] text-[var(--text-muted)]"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
