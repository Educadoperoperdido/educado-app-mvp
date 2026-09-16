import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";

export function OnboardingPage() {
  const { signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signInWithMagicLink(email);
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="min-h-screen bg-brand-black text-white flex flex-col justify-center px-6">
      <div className="max-w-sm mx-auto w-full space-y-6 text-center">
        <p className="label-caps text-xs text-brand-gold tracking-widest">Educado, Pero Perdido</p>
        <h1 className="editorial text-3xl leading-tight">
          Cada decisión pequeña <span className="italic text-brand-gold">construye</span> tu libertad financiera
        </h1>
        <p className="text-white/60 text-sm">
          Registra tus decisiones conscientes, mira tu ahorro crecer y aprende lo que la escuela no te enseñó.
        </p>

        {sent ? (
          <p className="text-brand-gold text-sm">
            Revisa tu correo — te enviamos un enlace para entrar.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-gray border border-white/10 rounded-full px-5 py-3 text-sm outline-none focus:border-brand-gold text-center"
            />
            <Button type="submit" className="w-full">
              Empezar
            </Button>
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
