import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { SavingsCounter } from "../components/dashboard/SavingsCounter";
import { StreakBadge } from "../components/dashboard/StreakBadge";
import { GoalProgressCard } from "../components/dashboard/GoalProgressCard";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) return <p className="text-white/50 text-center pt-20">Cargando...</p>;
  if (error) return <p className="text-red-400 text-center pt-20">{(error as Error).message}</p>;
  if (!data) return null;

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="editorial italic text-lg text-white/70">Hola,</p>
          <p className="editorial text-2xl">{data.profile.full_name ?? "bienvenido"}</p>
        </div>
        <StreakBadge streak={data.profile.current_streak} />
      </header>

      <SavingsCounter
        monthSaved={data.month_saved}
        decisionsCount={data.decisions_this_month}
        currency={data.profile.currency}
      />

      <Link to="/nueva-decision">
        <Button className="w-full flex items-center justify-center gap-2">
          <Plus size={18} /> Registrar decisión
        </Button>
      </Link>

      <GoalProgressCard goal={data.active_goal} />

      {data.recommended_lesson && (
        <Card>
          <p className="label-caps text-xs text-brand-gold/80 mb-1">
            Capítulo {data.recommended_lesson.chapter_number} — {data.recommended_lesson.chapter_title}
          </p>
          <p className="editorial text-lg mb-2">{data.recommended_lesson.title}</p>
          <p className="text-sm text-white/70">{data.recommended_lesson.content_short}</p>
          <Link to="/lecciones" className="label-caps text-xs text-brand-gold underline mt-3 inline-block">
            Ver todas las lecciones
          </Link>
        </Card>
      )}
    </div>
  );
}
