import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Coffee,
  Utensils,
  Car,
  ShoppingBag,
  Repeat,
  Sparkles,
  ShoppingCart,
  Tag,
  Droplet,
  Pill,
  Store,
  Film,
  Dumbbell,
  Smartphone,
  Landmark,
  Cookie,
  Shirt,
  CupSoda,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useCreateDecision } from "../../hooks/useDecisions";
import { useCategories } from "../../hooks/useCategories";

const ICONS: Record<string, LucideIcon> = {
  coffee: Coffee,
  utensils: Utensils,
  car: Car,
  "shopping-bag": ShoppingBag,
  repeat: Repeat,
  sparkles: Sparkles,
  "shopping-cart": ShoppingCart,
  tag: Tag,
  droplet: Droplet,
  pill: Pill,
  store: Store,
  film: Film,
  dumbbell: Dumbbell,
  smartphone: Smartphone,
  landmark: Landmark,
  cookie: Cookie,
  shirt: Shirt,
  "cup-soda": CupSoda,
};

function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Sparkles;
}

export function DecisionForm() {
  const navigate = useNavigate();
  const createDecision = useCreateDecision();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [expensiveLabel, setExpensiveLabel] = useState("");
  const [expensiveAmount, setExpensiveAmount] = useState("");
  const [cheapLabel, setCheapLabel] = useState("");
  const [cheapAmount, setCheapAmount] = useState("");
  const [note, setNote] = useState("");

  // Selecciona la primera categoría automáticamente en cuanto cargan
  useEffect(() => {
    if (categories && categories.length > 0 && selectedCategoryId === null) {
      const first = categories[0];
      setSelectedCategoryId(first.id);
      setExpensiveLabel(first.example_expensive ?? "");
      setCheapLabel(first.example_cheap ?? "");
    }
  }, [categories, selectedCategoryId]);

  const saved =
    Number(expensiveAmount || 0) - Number(cheapAmount || 0) > 0
      ? Number(expensiveAmount) - Number(cheapAmount)
      : 0;

  function selectCategory(cat: NonNullable<typeof categories>[number]) {
    setSelectedCategoryId(cat.id);
    setExpensiveLabel(cat.example_expensive ?? "");
    setCheapLabel(cat.example_cheap ?? "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createDecision.mutateAsync({
      category_id: selectedCategoryId,
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
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        {loadingCategories && <p className="text-white/40 text-xs">Cargando categorías...</p>}
        {categories?.map((cat) => {
          const Icon = getIcon(cat.icon);
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => selectCategory(cat)}
              className={`shrink-0 flex items-center gap-1.5 label-caps text-xs px-4 py-2 rounded-full border whitespace-nowrap ${
                isSelected
                  ? "bg-brand-gold text-brand-black border-brand-gold"
                  : "border-white/20 text-white/70"
              }`}
            >
              <Icon size={14} />
              {cat.name}
            </button>
          );
        })}
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
