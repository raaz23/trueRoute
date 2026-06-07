"use client";

const steps = [
  {
    number: "01",
    icon: "📱",
    title: "Open TrueRoute",
    description: "No sign up needed to browse. Just open the app and start exploring Nepal's cities, places, and fair prices instantly.",
  },
  {
    number: "02",
    icon: "🔍",
    title: "Search any place or service",
    description: "Type 'rickshaw to Boudhanath' or 'Dal Bhat price' or 'hotels in Pokhara' — get instant, locally-verified answers.",
  },
  {
    number: "03",
    icon: "💰",
    title: "See the verified fair price",
    description: "Tourist price vs. local price, side by side. Updated weekly by real locals. Always know what's fair before you pay.",
  },
  {
    number: "04",
    icon: "✅",
    title: "Travel confidently",
    description: "Show the screen to your driver or vendor. They'll know you know the real price. Save money. Avoid scams. Explore freely.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-[1120px] mx-auto">

        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="section-tag mb-5">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--gold)] inline-block" />
            How it works
          </div>
          <h2 className="font-display text-[42px] md:text-[52px] font-bold leading-tight mb-5">
            Four steps to<br />
            <span className="grad-gold">honest travel.</span>
          </h2>
          <p className="text-[16px] text-[var(--text-muted)] max-w-[520px] mx-auto">
            No complicated setup. No tourist traps. Just open TrueRoute and know
            the truth about every price, place, and route in Nepal.
          </p>
        </div>

        {/* Steps — Desktop: horizontal with connecting lines, Mobile: vertical */}
        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-[70px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

          <div className="grid md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`reveal reveal-delay-${i + 1} relative flex flex-col items-center text-center`}
              >
                {/* Icon circle */}
                <div className="relative z-10 w-[140px] h-[140px] rounded-full bg-[var(--bg-card)] border-2 border-[var(--gold)]/25 flex items-center justify-center mb-6 group hover:border-[var(--gold)]/60 hover:scale-105 transition-all duration-300">
                  {/* Number badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--gold)] to-[#A87C10] flex items-center justify-center font-display text-[14px] font-bold text-white shadow-lg">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display text-[22px] font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                  {step.description}
                </p>

                {/* Connecting arrow — mobile only, between steps */}
                {i < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--gold)]">
                      <path d="M12 5v14m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="reveal text-center mt-16">
          <button
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-gradient-to-r from-[#D4A017] to-[#A87C10] text-white text-[15px] font-semibold px-8 py-4 rounded-xl hover:shadow-[0_12px_32px_rgba(212,160,23,0.4)] hover:-translate-y-1 transition-all duration-300"
          >
            Get started — free forever →
          </button>
          <p className="text-[12px] text-[var(--text-muted)] mt-4">
            No credit card · No sign up required · Works offline
          </p>
        </div>
      </div>
    </section>
  );
}
