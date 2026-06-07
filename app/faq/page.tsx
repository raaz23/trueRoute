import MarketingShell from "@/components/landing/MarketingShell";
import FAQ from "@/components/landing/FAQ";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — TrueRoute",
  description:
    "Answers about free access, fair price verification, offline mode, negotiating, and contributing prices on TrueRoute.",
};

export default function FaqPage() {
  return (
    <MarketingShell>
      <FAQ />
    </MarketingShell>
  );
}
