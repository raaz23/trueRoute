import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import AppProviders from "@/components/providers/AppProviders";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#D4A017",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trueroute.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TrueRoute — Honest Travel Companion for Nepal",
    template: "%s | TrueRoute",
  },
  description:
    "Real travel service for Nepal: verified fair prices in NPR, AI guide, offline maps, live translation, emergency contacts. Free PWA for tourists.",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  keywords: [
    "Nepal travel app",
    "Kathmandu fair taxi price",
    "Pokhara travel guide",
    "Nepal tourist scam prevention",
    "offline Nepal travel",
    "TrueRoute",
  ],
  openGraph: {
    title: "TrueRoute — Honest Travel Companion for Nepal",
    description: "Fair prices, AI guide, emergency tools — working travel service, not just a landing page.",
    url: siteUrl,
    siteName: "TrueRoute",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrueRoute — Travel Nepal Honestly",
    description: "Fair NPR prices, AI guide, offline pack — free for tourists.",
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TrueRoute",
  },
  applicationName: "TrueRoute",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${jakarta.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html >
  );
}
