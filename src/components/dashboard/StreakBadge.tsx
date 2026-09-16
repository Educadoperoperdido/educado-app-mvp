import { Flame } from "lucide-react";

export function StreakBadge({ streak }: { streak: number }) {
  if (streak === 0) {
    return (
      <div className="flex items-center gap-2 text-white/50 text-sm">
        <Flame size={18} />
        <span>Registra tu primera decisión hoy</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-brand-gold">
      <Flame size={18} />
      <span className="label-caps text-sm">
        {streak} {streak === 1 ? "día" : "días"} seguidos
      </span>
    </div>
  );
}
