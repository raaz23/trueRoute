import Navbar      from "@/components/landing/Navbar";
import Hero        from "@/components/landing/Hero";
import Problem     from "@/components/landing/Problem";
import FairPrice   from "@/components/landing/FairPrice";
import Cities      from "@/components/landing/Cities";
import Waitlist    from "@/components/landing/Waitlist";
import Footer      from "@/components/landing/Footer";
import ScrollReveal from "@/components/landing/ScrollReveal";
import FQA         from   "@/components/landing/FQA";
import HowItWorks from    "@/components/landing/HowItWorks";

export default function LandingPage() {
  return (
    <main className="grain">
      {/* Scroll reveal observer (client component) */}
      <ScrollReveal />

      {/* Fixed navigation */}
      <Navbar />

      {/* ── Sections in order ── */}
      <Hero />
      <Problem />
      <FairPrice />
      <Cities />
      <FQA />
      <Waitlist />
      <HowItWorks/>
      <Footer />
    </main>
  );
}
