import { Card } from "../ui/Card";

export function SavingsCounter({
  monthSaved,
  decisionsCount,
  currency,
}: {
  monthSaved: number;
  decisionsCount: number;
  currency: string;
}) {
  return (
    <Card className="text-center py-8">
      <p className="label-caps text-xs text-brand-gold/80 mb-2">Ahorro consciente este mes</p>
      <p className="editorial text-5xl text-brand-gold">
        {currency === "USD" ? "$" : ""}
        {monthSaved.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
      </p>
      <p className="text-sm text-white/50 mt-2">
        {decisionsCount} {decisionsCount === 1 ? "decisión consciente" : "decisiones conscientes"}
      </p>
    </Card>
  );
}
