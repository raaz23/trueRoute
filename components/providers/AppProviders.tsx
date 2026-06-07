"use client";

import AuthProvider from "@/components/auth/AuthProvider";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import OfflineBanner from "@/components/pwa/OfflineBanner";
import InstallPWA from "@/components/pwa/InstallPWA";
import OfflineSyncManager from "@/components/pwa/OfflineSyncManager";
import BackOnlineSync from "@/components/pwa/BackOnlineSync";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ServiceWorkerRegister />
      <OfflineSyncManager />
      <BackOnlineSync />
      <OfflineBanner />
      <InstallPWA />
      {children}
    </AuthProvider>
  );
}
