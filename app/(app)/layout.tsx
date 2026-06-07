import AppChrome from "@/components/app/AppChrome";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppChrome>{children}</AppChrome>;
}
