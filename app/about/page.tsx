import MarketingShell from "@/components/landing/MarketingShell";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — TrueRoute",
  description: "Why TrueRoute exists — a founder story about honest travel in Nepal and beyond.",
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <article className="mx-auto max-w-[720px] px-6">
        <header className="mb-10 text-center md:text-left">
          <div className="section-tag mb-5 inline-flex items-center gap-2">
            <span className="inline-block h-[5px] w-[5px] rounded-full bg-[var(--gold)]" />
            Our story
          </div>
          <h1 className="font-display text-[40px] font-bold leading-tight md:text-[48px]">
            The honest path <span className="grad-gold">started with a meter that lied.</span>
          </h1>
        </header>

        <div className="space-y-6 text-[16px] leading-relaxed text-[var(--text-muted)]">
          <p>
            TrueRoute began after one too many evenings hearing friends land in Kathmandu
            excited — then pay five times the fair taxi rate before they had even checked in.
            The problem was never “tourists do not research.” It was that trustworthy, timely
            numbers rarely exist in the same pocket as Google Maps.
          </p>
          <p>
            We built TrueRoute as the layer we wished we had: fair bands you can show without
            shame, translation that respects Nepali as a first-class language, and an AI guide
            that sounds like a sharp local friend — not a brochure bot.
          </p>
          <p>
            Nepal is the proving ground because the gap between local and tourist pricing is
            widest where hospitality is warmest. If we can make transparency feel normal here,
            the same stack travels anywhere tourists feel outmatched at the moment of payment.
          </p>
          <p className="text-[15px] text-[var(--text-mid)]">
            We are early. The waitlist keeps us honest about what to ship first — maps, prices,
            translation, or safety. If you have a receipt that does not match reality, we want
            it. That friction is the product.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold-muted)] p-6 text-center md:text-left">
          <p className="font-display text-lg font-semibold text-[var(--text)]">Travel with us.</p>
          <p className="mt-2 text-[14px] text-[var(--text-muted)]">
            Try the feature tour, read the FAQ, or jump straight to the waitlist.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              href="/features"
              className="rounded-xl border border-white/15 px-5 py-2.5 text-[14px] font-medium text-[var(--text)] hover:bg-white/5"
            >
              Features
            </Link>
            <Link
              href="/faq"
              className="rounded-xl border border-white/15 px-5 py-2.5 text-[14px] font-medium text-[var(--text)] hover:bg-white/5"
            >
              FAQ
            </Link>
            <Link
              href="/#waitlist"
              className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-2.5 text-[14px] font-semibold text-white"
            >
              Waitlist
            </Link>
          </div>
        </div>
      </article>
    </MarketingShell>
  );
}
