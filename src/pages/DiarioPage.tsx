import { useState } from "react";
import { useCreateJournalEntry, useJournalEntries } from "../hooks/useJournal";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const PROMPT_OF_DAY = "¿Qué decisión consciente tomaste hoy y cómo te hizo sentir?";

export function DiarioPage() {
  const { data, isLoading } = useJournalEntries();
  const createEntry = useCreateJournalEntry();
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    await createEntry.mutateAsync({ content });
    setContent("");
  }

  return (
    <div className="space-y-5">
      <h1 className="editorial text-2xl">Diario</h1>

      <Card>
        <p className="label-caps text-xs text-brand-gold/80 mb-2">Pregunta de hoy</p>
        <p className="editorial text-lg mb-4">{PROMPT_OF_DAY}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            className="w-full bg-transparent border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-brand-gold"
            rows={4}
            placeholder="Escribe aquí..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button type="submit" disabled={createEntry.isPending}>
            {createEntry.isPending ? "Guardando..." : "Guardar reflexión"}
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        <p className="label-caps text-xs text-white/50">Entradas anteriores</p>
        {isLoading && <p className="text-white/40 text-sm">Cargando...</p>}
        {data?.entries.map((entry) => (
          <Card key={entry.id}>
            <p className="text-xs text-white/40 mb-2">
              {new Date(entry.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "long" })}
            </p>
            <p className="text-sm text-white/90">{entry.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
