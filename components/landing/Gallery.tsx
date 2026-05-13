const shots = [
  { title: "Boudhanath at dawn", tag: "Kathmandu", gradient: "from-[#1a2844] via-[#2a3f5c] to-[#0F9D8D]/40", emoji: "🕌" },
  { title: "Phewa Lake mirror", tag: "Pokhara", gradient: "from-[#152838] via-[#1e4060] to-[#6B8FD4]/35", emoji: "🏔️" },
  { title: "Patan courtyards", tag: "Lalitpur", gradient: "from-[#2a1f18] via-[#4a3020] to-[#D4A017]/25", emoji: "🏛️" },
  { title: "Chitwan river safari", tag: "Chitwan", gradient: "from-[#1a3020] via-[#254028] to-[#0F9D8D]/30", emoji: "🐘" },
  { title: "Lumbini sacred garden", tag: "Lumbini", gradient: "from-[#1e2040] via-[#2a3060] to-[#A855F7]/25", emoji: "☮️" },
  { title: "Nagarkot ridge line", tag: "Nagarkot", gradient: "from-[#301828] via-[#4a2030] to-[#E05252]/20", emoji: "🌅" },
  { title: "Upper Mustang trails", tag: "Mustang", gradient: "from-[#282018] via-[#403020] to-[#D4A017]/20", emoji: "🏰" },
  { title: "Swayambhunath steps", tag: "Kathmandu", gradient: "from-[#182830] via-[#243848] to-[#6B8FD4]/30", emoji: "🐒" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center mb-14 reveal">
          <div className="section-tag mb-5">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--gold)] inline-block" />
            Places &amp; deep history
          </div>
          <h2 className="font-display text-[38px] md:text-[48px] font-bold leading-tight mb-4">
            Every place, a story.<br />
            <span className="grad-gold">In your pocket.</span>
          </h2>
          <p className="text-[15px] text-[var(--text-muted)] max-w-[520px] mx-auto leading-relaxed">
            Rich photos, video, legends, and the best time to visit — curated for tourists who want more than a postcard.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {shots.map((s, i) => (
            <div
              key={s.title}
              className={`reveal reveal-delay-${(i % 4) + 1} group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/8 bg-[var(--bg-card)] card-hover`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-40 group-hover:opacity-55 transition-opacity">
                {s.emoji}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--gold)] mb-1">{s.tag}</div>
                <div className="font-display text-[15px] md:text-[16px] font-semibold leading-snug">{s.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
