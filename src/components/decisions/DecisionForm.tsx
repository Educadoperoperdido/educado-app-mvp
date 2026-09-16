import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useCreateDecision } from "../../hooks/useDecisions";

const CATEGORY_PRESETS = [
  { label: "Café", expensive: "Starbucks", cheap: "Café OXXO" },
  { label: "Comida", expensive: "Restaurante", cheap: "Comida casera" },
  { label: "Transporte", expensive: "Uber", cheap: "Transporte público" },
  { label: "Libre", expensive: "", cheap: "" },
];

export function DecisionForm() {
  const navigate = useNavigate();
  const createDecision = useCreateDecision();

  const [preset, setPreset] = useState(CATEGORY_PRESETS[0]);
  const [expensiveLabel, setExpensiveLabel] = useState(preset.expensive);
  const [expensiveAmount, setExpensiveAmount] = useState("");
  const [cheapLabel, setCheapLabel] = useState(preset.cheap);
  const [cheapAmount, setCheapAmount] = useState("");
  const [note, setNote] = useState("");

  const saved =
    Number(expensiveAmount || 0) - Number(cheapAmount || 0) > 0
      ? Number(expensiveAmount) - Number(cheapAmount)
      : 0;

  function selectPreset(p: (typeof CATEGORY_PRESETS)[number]) {
    setPreset(p);
    setExpensiveLabel(p.expensive);
    setCheapLabel(p.cheap);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createDecision.mutateAsync({
      category_id: null,
      expensive_label: expensiveLabel,
      expensive_amount: Number(expensiveAmount),
      cheap_label: cheapLabel,
      cheap_amount: Number(cheapAmount),
      note: note || undefined,
    });
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {CATEGORY_PRESETS.map((p) => (
          <button
            type="button"
            key={p.label}
            onClick={() => selectPreset(p)}
            className={`label-caps text-xs px-4 py-2 rounded-full border ${
              preset.label === p.label
                ? "bg-brand-gold text-brand-black border-brand-gold"
                : "border-white/20 text-white/70"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Card>
        <label className="label-caps text-xs text-white/50">Opción más cara</label>
        <input
          className="w-full bg-transparent border-b border-white/20 py-2 mb-4 outline-none focus:border-brand-gold"
          placeholder="ej. Starbucks"
          value={expensiveLabel}
          onChange={(e) => setExpensiveLabel(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-brand-gold"
          placeholder="Monto"
          value={expensiveAmount}
          onChange={(e) => setExpensiveAmount(e.target.value)}
          required
        />
      </Card>

      <Card>
        <label className="label-caps text-xs text-white/50">Opción que elegiste</label>
        <input
          className="w-full bg-transparent border-b border-white/20 py-2 mb-4 outline-none focus:border-brand-gold"
          placeholder="ej. Café OXXO"
          value={cheapLabel}
          onChange={(e) => setCheapLabel(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-brand-gold"
          placeholder="Monto"
          value={cheapAmount}
          onChange={(e) => setCheapAmount(e.target.value)}
          required
        />
      </Card>

      <textarea
        className="w-full bg-brand-gray border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-brand-gold"
        placeholder="Nota opcional: ¿cómo te sentiste al elegir?"
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="text-center">
        <p className="label-caps text-xs text-white/50">Ahorraste</p>
        <p className="editorial text-4xl text-brand-gold">${saved.toFixed(2)}</p>
      </div>

      {createDecision.isError && (
        <p className="text-red-400 text-sm text-center">{(createDecision.error as Error).message}</p>
      )}

      <Button type="submit" className="w-full" disabled={createDecision.isPending}>
        {createDecision.isPending ? "Guardando..." : "Registrar decisión"}
      </Button>
    </form>
  );
}
