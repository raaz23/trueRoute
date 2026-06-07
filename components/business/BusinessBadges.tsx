import type { BadgeType } from "@prisma/client";
import { BADGE_META } from "@/lib/business/constants";

export default function BusinessBadges({
  badges,
  size = "sm",
}: {
  badges: { badgeType: BadgeType }[];
  size?: "sm" | "md";
}) {
  if (!badges.length) return null;

  const cls =
    size === "md"
      ? "px-2.5 py-1 text-[11px]"
      : "px-2 py-0.5 text-[10px]";

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((b) => {
        const meta = BADGE_META[b.badgeType];
        return (
          <span
            key={b.badgeType}
            title={meta.description}
            className={`rounded-full border font-semibold uppercase tracking-wide ${cls}`}
            style={{
              borderColor: `${meta.color}40`,
              backgroundColor: `${meta.color}15`,
              color: meta.color,
            }}
          >
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}
