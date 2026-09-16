import { useRecommendedLessons } from "../hooks/useLessons";
import { Card } from "../components/ui/Card";

export function LeccionesPage() {
  const { data, isLoading } = useRecommendedLessons();

  return (
    <div className="space-y-5">
      <h1 className="editorial text-2xl">Lecciones para ti</h1>
      <p className="text-white/50 text-sm">
        Elegidas según tu arquetipo del test y tus áreas de oportunidad.
      </p>

      {isLoading && <p className="text-white/40 text-sm">Cargando...</p>}

      <div className="space-y-3">
        {data?.lessons.map((lesson) => (
          <Card key={lesson.id}>
            <p className="label-caps text-xs text-brand-gold/80 mb-1">
              Capítulo {lesson.chapter_number} — {lesson.chapter_title}
            </p>
            <p className="editorial text-lg mb-2">{lesson.title}</p>
            <p className="text-sm text-white/70">{lesson.content_short}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
