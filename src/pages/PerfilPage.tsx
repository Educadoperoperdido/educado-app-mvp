import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../hooks/useAuth";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export function PerfilPage() {
  const { data } = useDashboard();
  const { signOut } = useAuth();

  return (
    <div className="space-y-5">
      <h1 className="editorial text-2xl">Perfil</h1>

      <Card className="text-center py-6">
        <p className="label-caps text-xs text-white/50">Tu arquetipo</p>
        <p className="editorial text-2xl text-brand-gold mt-1">
          {data?.profile.archetype ?? "Aún no has hecho el test"}
        </p>
      </Card>

      <Card className="text-center py-6">
        <p className="label-caps text-xs text-white/50">Racha más larga</p>
        <p className="editorial text-2xl mt-1">{data?.profile.longest_streak ?? 0} días</p>
      </Card>

      {!data?.profile.archetype && (
        <Card>
          <p className="label-caps text-xs text-brand-gold/80 mb-2">¿Aún no conoces tu arquetipo?</p>
          <p className="text-sm text-white/70 mb-3">
            Haz el test de 10 preguntas y esta app va a recomendarte lecciones según tus áreas de oportunidad.
          </p>
          <a href="https://educadoperdido.lovable.app" target="_blank" rel="noreferrer">
            <Button variant="ghost">Hacer el test</Button>
          </a>
        </Card>
      )}

      <Card>
        <p className="label-caps text-xs text-brand-gold/80 mb-2">Educado, Pero Perdido — el libro</p>
        <p className="text-sm text-white/70 mb-3">
          Profundiza en cada concepto que trabajas en la app leyendo el capítulo completo.
        </p>
        {/* TODO: reemplazar con el link real del libro cuando esté publicado en KDP */}
        <a href="https://educadoperoperdido.com" target="_blank" rel="noreferrer">
          <Button variant="ghost">Conoce el libro</Button>
        </a>
      </Card>

      <button onClick={signOut} className="text-white/40 text-sm underline w-full text-center">
        Cerrar sesión
      </button>
    </div>
  );
}
