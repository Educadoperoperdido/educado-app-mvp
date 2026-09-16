import { useState } from "react";
import { useCreateGoal, useGoals } from "../hooks/useGoals";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";

export function MetasPage() {
  const { data, isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createGoal.mutateAsync({ name, target_amount: Number(target) });
    setName("");
    setTarget("");
    setShowForm(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="editorial text-2xl">Metas</h1>
        <button onClick={() => setShowForm((s) => !s)} className="label-caps text-xs text-brand-gold underline">
          {showForm ? "Cancelar" : "Nueva meta"}
        </button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-brand-gold"
              placeholder="Nombre de la meta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="number"
              className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-brand-gold"
              placeholder="Monto objetivo"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />
            <Button type="submit" disabled={createGoal.isPending}>
              {createGoal.isPending ? "Creando..." : "Crear meta"}
            </Button>
          </form>
        </Card>
      )}

      {isLoading && <p className="text-white/40 text-sm">Cargando...</p>}

      <div className="space-y-3">
        {data?.goals.map((goal) => (
          <Card key={goal.id}>
            <div className="flex items-center justify-between mb-2">
              <p className="editorial text-lg">{goal.name}</p>
              <p className="text-sm text-brand-gold">
                ${goal.current_amount.toLocaleString("es-MX")} / ${goal.target_amount.toLocaleString("es-MX")}
              </p>
            </div>
            <ProgressBar value={goal.current_amount} max={goal.target_amount} />
          </Card>
        ))}
      </div>
    </div>
  );
}
