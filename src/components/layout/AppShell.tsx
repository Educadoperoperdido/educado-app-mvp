import type { PropsWithChildren } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-brand-black text-white pb-24">
      <main className="max-w-md mx-auto px-4 pt-6">{children}</main>
      <BottomNav />
    </div>
  );
}
