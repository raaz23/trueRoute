import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up — TrueRoute",
  description: "Create a TrueRoute account for early access and synced travel tools.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
