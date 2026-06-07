import MarketingShell from "@/components/landing/MarketingShell";
import Features from "@/components/landing/Features";
import AIChat from "@/components/landing/AIChat";
import Translation from "@/components/landing/Translation";
import Emergency from "@/components/landing/Emergency";
import MapPreview from "@/components/landing/MapPreview";
import Gallery from "@/components/landing/Gallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — TrueRoute",
  description:
    "Fair prices, AI guide, live translation, emergency panel, smart maps, and place galleries for honest travel in Nepal.",
};

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <Features />
      <AIChat />
      <Translation />
      <Emergency />
      <MapPreview />
      <Gallery />
    </MarketingShell>
  );
}
