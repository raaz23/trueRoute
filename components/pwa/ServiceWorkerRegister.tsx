"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        reg.update().catch(() => {});
      } catch {
        /* SW optional in dev */
      }
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register);
  }, []);

  return null;
}
