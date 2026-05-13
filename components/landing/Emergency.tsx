"use client";

export default function Emergency() {
  const contacts = [
    { icon: "🚨", label: "Nepal Police",     number: "100",  color: "var(--red)"  },
    { icon: "🏥", label: "Ambulance",         number: "102",  color: "var(--red)"  },
    { icon: "🏛️", label: "Tourist Police",   number: "1144", color: "var(--gold)" },
    { icon: "🔥", label: "Fire Brigade",      number: "101",  color: "#F97316"     },
    { icon: "🏔️", label: "Mountain Rescue",  number: "4411767", color: "var(--teal)" },
    { icon: "🏥", label: "CIWEC Clinic",      number: "4435232", color: "var(--teal)" },
  ];

  return (
    <section id="emergency" className="py-20 px-6 border-t border-white/5"
      style={{ background: "linear-gradient(180deg, rgba(212,160,23,0.03) 0%, transparent 100%)" }}
    >
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center mb-12 reveal">
          <div className="section-tag mb-5">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--gold)] inline-block" />
            Emergency Panel
          </div>
          <h2 className="font-display text-[38px] md:text-[48px] font-bold leading-tight mb-4">
            One tap. Right number.<br />Always safe.
          </h2>
          <p className="text-[15px] text-[var(--text-muted)] max-w-[480px] mx-auto">
            Auto-detects your location and shows the correct local emergency contacts.
            Never search for numbers when every second counts.
          </p>
        </div>

        <div className="reveal grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {contacts.map((c) => (
            <div
              key={c.label}
              className="card-hover bg-[var(--bg-card)] border border-white/6 rounded-2xl p-5 text-center flex flex-col items-center gap-3"
            >
              <span className="text-3xl">{c.icon}</span>
              <div>
                <div className="text-[11px] text-[var(--text-muted)] mb-1.5">{c.label}</div>
                <div className="font-display text-[22px] font-bold" style={{ color: c.color }}>{c.number}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-8 bg-[var(--bg-card)] border border-white/6 rounded-2xl p-6 grid md:grid-cols-3 gap-6 text-center">
          {[
            { icon: "📍", title: "GPS location sharing", desc: "Share your exact location with emergency services or family with one tap." },
            { icon: "🌐", title: "Embassy finder", desc: "Find your country's embassy in Nepal instantly. All countries covered." },
            { icon: "💊", title: "Medical phrases", desc: "Describe your symptoms in Nepali to doctors and pharmacists — AI translated." },
          ].map(({ icon, title, desc }) => (
            <div key={title}>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-[13px] font-semibold mb-1.5">{title}</div>
              <div className="text-[12px] text-[var(--text-muted)]">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
