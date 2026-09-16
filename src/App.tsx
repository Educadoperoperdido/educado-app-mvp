import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { AppShell } from "./components/layout/AppShell";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NuevaDecisionPage } from "./pages/NuevaDecisionPage";
import { DiarioPage } from "./pages/DiarioPage";
import { LeccionesPage } from "./pages/LeccionesPage";
import { MetasPage } from "./pages/MetasPage";
import { PerfilPage } from "./pages/PerfilPage";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-brand-black flex items-center justify-center text-white/40">Cargando...</div>;
  }

  if (!user) {
    return <OnboardingPage />;
  }

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/nueva-decision" element={<NuevaDecisionPage />} />
          <Route path="/diario" element={<DiarioPage />} />
          <Route path="/lecciones" element={<LeccionesPage />} />
          <Route path="/metas" element={<MetasPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
