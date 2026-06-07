import Navbar from "@/components/landing/Navbar";
import ScrollReveal from "@/components/landing/ScrollReveal";
import Footer from "@/components/landing/Footer";

export default function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grain min-h-screen pb-12 pt-24 md:pt-28">
      <ScrollReveal />
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
