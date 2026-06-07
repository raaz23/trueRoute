"use client";

import EmergencyPanel from "@/components/shared/EmergencyPanel";
import { useOfflineBundle } from "@/hooks/useOfflineBundle";

export default function EmergencyPage() {
  const { bundle, hasOfflineData } = useOfflineBundle();

  return (
    <div className="space-y-4">
      <EmergencyPanel contacts={bundle?.emergency ?? []} />
      {hasOfflineData && (
        <p className="text-center text-[12px] text-[var(--teal)]">
          ✓ Emergency numbers available offline
        </p>
      )}
    </div>
  );
}
