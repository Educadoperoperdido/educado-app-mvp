import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DecisionForm } from "../components/decisions/DecisionForm";

export function NuevaDecisionPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="text-white/50 flex items-center gap-1 text-sm">
        <ArrowLeft size={16} /> Volver
      </button>
      <h1 className="editorial text-2xl">¿Qué decisión tomaste hoy?</h1>
      <DecisionForm />
    </div>
  );
}
