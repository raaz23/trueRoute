import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in — TrueRoute",
  description: "Sign in to TrueRoute to sync your travel data and contributor badges.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
