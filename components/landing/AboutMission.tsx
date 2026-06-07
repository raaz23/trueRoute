import { prisma } from "@/lib/prisma";

export default async function AboutMission() {
  const settings = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const mission =
    map.about_mission ||
    "TrueRoute was born in Nepal — from watching tourists overcharged every single day.";
  const founder = map.founder_name || "TrueRoute Founder";
  const location = map.founder_location || "Birgunj, Nepal";

  return (
    <section id="about" className="border-t border-white/5 py-24 px-6">
      <div className="mx-auto grid max-w-[1120px] gap-12 md:grid-cols-2 md:items-center">
        <div className="reveal">
          <div className="section-tag mb-5">Our mission</div>
          <h2 className="font-display text-[38px] font-bold leading-tight md:text-[48px]">
            Built by someone who <span className="grad-gold">saw the scams</span> daily
          </h2>
        </div>
        <div className="reveal rounded-2xl border border-white/8 bg-[var(--bg-card)] p-8">
          <p className="text-[16px] leading-relaxed text-[var(--text-mid)]">{mission}</p>
          <p className="mt-6 text-[14px] font-semibold text-[var(--gold)]">
            — {founder}, {location}
          </p>
          <a
            href="/about"
            className="mt-6 inline-block text-[13px] font-semibold text-[var(--teal)] hover:underline"
          >
            Read full story →
          </a>
        </div>
      </div>
    </section>
  );
}
