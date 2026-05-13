export default function MapPreview() {
  return (
    <section
      id="map"
      className="py-24 px-6 border-t border-white/5"
      style={{ background: "linear-gradient(180deg, rgba(107,143,212,0.06) 0%, transparent 55%)" }}
    >
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center mb-12 reveal">
          <div className="section-tag mb-5">
            <span className="w-[5px] h-[5px] rounded-full bg-[#6B8FD4] inline-block" />
            Smart Route Maps · OpenStreetMap
          </div>
          <h2 className="font-display text-[38px] md:text-[48px] font-bold leading-tight mb-4">
            Free maps. Step-by-step.<br />
            <span className="grad-gold">No Google required.</span>
          </h2>
          <p className="text-[15px] text-[var(--text-muted)] max-w-[520px] mx-auto leading-relaxed">
            Preview how TrueRoute lays routes on OpenStreetMap — distance, time, transport options,
            and the fair fare for each leg.
          </p>
        </div>

        <div className="reveal bg-[var(--bg-card)] border border-white/8 rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-[#0a1224]">
            <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">
              Route preview · Kathmandu
            </span>
            <span className="ml-auto text-[10px] text-[#6B8FD4] font-medium">OSM</span>
          </div>

          <div className="relative aspect-[16/10] md:aspect-[21/9] grid-bg bg-[#0a1428]">
            {/* Decorative “map” blocks */}
            <div className="absolute inset-0 opacity-[0.35]">
              <div className="absolute top-[12%] left-[8%] w-[28%] h-[18%] rounded-lg bg-[#1a2844] border border-white/6" />
              <div className="absolute bottom-[18%] right-[10%] w-[32%] h-[22%] rounded-lg bg-[#152038] border border-white/5" />
              <div className="absolute top-[40%] right-[22%] w-[20%] h-[14%] rounded-md bg-[#1e2d48] border border-white/5 rotate-6" />
            </div>

            {/* Route polyline */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6B8FD4" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#6B8FD4" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0F9D8D" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              <path
                d="M 120 280 Q 260 120 420 200 T 720 140 T 880 200"
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="14 10"
              />
            </svg>

            {/* Pins */}
            <div className="absolute left-[10%] top-[58%] flex flex-col items-center">
              <span className="text-2xl drop-shadow-lg">📍</span>
              <span className="mt-1 text-[10px] font-semibold bg-black/50 px-2 py-0.5 rounded-full border border-white/10">
                Thamel
              </span>
            </div>
            <div className="absolute left-[48%] top-[38%] flex flex-col items-center -translate-x-1/2">
              <span className="text-2xl drop-shadow-lg">🕌</span>
              <span className="mt-1 text-[10px] font-semibold bg-black/50 px-2 py-0.5 rounded-full border border-white/10">
                Boudhanath
              </span>
            </div>
            <div className="absolute right-[10%] top-[42%] flex flex-col items-center">
              <span className="text-2xl drop-shadow-lg">🛺</span>
              <span className="mt-1 text-[10px] font-semibold bg-[var(--teal)]/20 text-[var(--teal)] px-2 py-0.5 rounded-full border border-[var(--teal)]/30">
                Fair · NPR 120
              </span>
            </div>

            {/* Floating info card */}
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[280px] bg-[var(--bg-card)]/95 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                Suggested route
              </div>
              <div className="font-display text-[16px] font-semibold mb-1">Thamel → Boudhanath</div>
              <div className="flex flex-wrap gap-3 text-[12px] text-[var(--text-muted)]">
                <span>~5.2 km</span>
                <span>·</span>
                <span>~22 min</span>
                <span>·</span>
                <span className="text-[var(--teal)]">Rickshaw fair NPR 100–140</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
