import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map — TrueRoute",
  description:
    "Stadia Maps on TrueRoute — search, directions, and nearby services across Nepal.",
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
