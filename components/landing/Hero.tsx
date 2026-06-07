"use client";

import Link from "next/link";

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20 px-6 overflow-hidden topo-bg">

          {/* ── Background glow blobs ── */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(212,160,23,0.07)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(15,157,141,0.05)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-[radial-gradient(ellipse,rgba(212,160,23,0.04)_0%,transparent_70%)] pointer-events-none" />

          <div className="max-w-[1120px] mx-auto w-full grid md:grid-cols-2 gap-16 items-center">

            {/* ── Left: Copy ── */}
            <div>
              {/* Tag */}
              <div className="anim-fade-up-1 section-tag mb-5">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--gold)] inline-block" />
                Live in Nepal · Kathmandu, Pokhara &amp; more
              </div>

              {/* Headline */}
              <h1 className="anim-fade-up-2 font-display text-[52px] md:text-[68px] font-bold leading-[1.04] tracking-tight mb-6">
                Travel smart.<br />
                <span className="grad-gold">Pay what&apos;s fair.</span><br />
                <em className="font-medium italic text-[var(--text-mid)]">Go anywhere.</em>
              </h1>

              {/* Subheading */}
              <p className="anim-fade-up-3 text-[16px] md:text-[17px] text-[var(--text-muted)] leading-relaxed max-w-[480px] mb-8">
                TrueRoute is your honest travel companion for Nepal — verified fair prices,
                AI-powered route guidance, live translation between any language and Nepali,
                deep knowledge of every place. No scams. No overcharging. No getting lost.
              </p>

              {/* CTA Buttons */}
              <div className="anim-fade-up-4 flex flex-wrap gap-4 mb-12">
                <Link
                  href="/map"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-[#D4A017] to-[#A87C10] text-white text-[15px] font-semibold px-7 py-4 rounded-xl hover:shadow-[0_12px_32px_rgba(212,160,23,0.4)] hover:-translate-y-1 transition-all duration-300"
                >
                  Open app — start exploring →
                </Link>
                <button
                  type="button"
                  onClick={() => scrollTo("waitlist")}
                  className="inline-flex items-center justify-center border border-white/15 text-[var(--text)] text-[15px] font-medium px-7 py-4 rounded-xl hover:bg-white/5 hover:border-white/30 transition-all duration-300"
                >
                  Join waitlist
                </button>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center text-[14px] font-medium text-[var(--teal)] px-2 py-4 hover:underline"
                >
                  Sign in with Google
                </Link>
              </div>

              {/* Stats */}
              <div className="anim-fade-up-5 flex gap-8 flex-wrap">
                {[
                  { n: "6+",    l: "Cities in Nepal" },
                  { n: "100%",  l: "Free to use"     },
                  { n: "12+",   l: "Languages"        },
                  { n: "0",     l: "Scams tolerated"  },
                ].map(({ n, l }) => (
                  <div key={l}>
                    <div className="font-display text-[28px] font-bold text-[var(--gold)]">{n}</div>
                    <div className="text-[12px] text-[var(--text-muted)] mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Floating UI Cards ── */}
            <div className="anim-fade-up-3 relative h-[520px] hidden md:block">

              {/* Main card: Fair Price */}
              <div className="anim-float-a absolute inset-x-0 top-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[var(--gold)] anim-dot" />
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
                    Fair Price Check · Kathmandu
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">🛺</span>
                  <div>
                    <div className="text-[15px] font-semibold">Rickshaw — Thamel → Patan</div>
                    <div className="text-[12px] text-[var(--text-muted)]">2.4 km · approx 18 minutes</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[var(--red-muted)] border border-[#E05252]/20 rounded-xl p-4 text-center">
                    <div className="text-[10px] font-semibold text-[var(--red)] mb-1">They&apos;ll charge</div>
                    <div className="font-display text-[28px] font-bold text-[var(--red)]">NPR 500</div>
                  </div>
                  <div className="bg-[var(--teal-muted)] border border-[var(--teal)]/20 rounded-xl p-4 text-center">
                    <div className="text-[10px] font-semibold text-[var(--teal)] mb-1">Fair price</div>
                    <div className="font-display text-[28px] font-bold text-[var(--teal)]">NPR 120</div>
                  </div>
                </div>

                <div className="bg-[var(--gold-muted)] border border-[var(--gold)]/15 rounded-xl p-3 text-center">
                  <span className="text-[12px] font-semibold text-[var(--gold)]">
                    🎉 Show this to your driver · Save NPR 380 (76%)
                  </span>
                </div>
              </div>

              {/* AI Chat card */}
              <div className="anim-float-b absolute bottom-20 right-0 w-[230px] bg-[var(--bg-card)] border border-[var(--teal)]/25 rounded-2xl p-4 shadow-[0_20px_48px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--teal)] anim-dot" />
                  <span className="text-[10px] text-[var(--text-muted)]">AI Guide · Online</span>
                </div>
                <p className="text-[12px] font-medium mb-2">&ldquo;Route from Thamel to Boudhanath?&rdquo;</p>
                <p className="text-[11px] text-[var(--text-mid)] leading-relaxed">
                  Local bus from Ratna Park — NPR 20. Say &ldquo;Bouddha&rdquo;. ~25 mins. Go early! 🕌
                </p>
              </div>

              {/* Translation card */}
              <div className="anim-float-c absolute bottom-4 left-4 w-[190px] bg-[var(--bg-card)] border border-[var(--gold)]/20 rounded-2xl p-3.5 shadow-[0_20px_48px_rgba(0,0,0,0.5)]">
                <div className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2">Live Translation</div>
                <div className="text-[12px] text-[var(--text-mid)] mb-1">यो कति हो? <span className="text-[10px] text-[var(--text-muted)]">(Nepali)</span></div>
                <div className="text-[13px] font-semibold text-[var(--gold)]">→ &ldquo;How much is this?&rdquo;</div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Scroll</div>
            <div className="w-[1px] h-10 bg-gradient-to-b from-[var(--gold)] to-transparent" />
          </div>
        </section>
      );
    }
