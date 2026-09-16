import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import type { SavingsGoal } from "../../types/database";

export function GoalProgressCard({ goal }: { goal: SavingsGoal | null }) {
  if (!goal) {
    return (
      <Card>
        <p className="text-white/70 text-sm mb-3">Todavía no tienes una meta activa.</p>
        <Link to="/metas" className="label-caps text-sm text-brand-gold underline">
          Crear tu primera meta
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="label-caps text-sm text-white/70">{goal.name}</p>
        <p className="text-sm text-brand-gold">
          ${goal.current_amount.toLocaleString("es-MX")} / ${goal.target_amount.toLocaleString("es-MX")}
        </p>
      </div>
      <ProgressBar value={goal.current_amount} max={goal.target_amount} />
    </Card>
  );
}
