import type { PropsWithChildren } from "react";

export function Card({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`bg-brand-gray border border-white/10 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}
