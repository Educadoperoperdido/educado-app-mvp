import { NavLink } from "react-router-dom";
import { BookOpen, Home, PiggyBank, User, PenLine } from "lucide-react";

const items = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/diario", label: "Diario", icon: PenLine },
  { to: "/lecciones", label: "Lecciones", icon: BookOpen },
  { to: "/metas", label: "Metas", icon: PiggyBank },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-black border-t border-white/10 flex justify-around py-2">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1 label-caps text-[10px] ${
              isActive ? "text-brand-gold" : "text-white/40"
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
