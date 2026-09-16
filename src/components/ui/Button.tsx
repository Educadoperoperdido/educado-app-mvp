import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export function Button({ variant = "primary", className = "", children, ...rest }: ButtonProps) {
  const base = "label-caps text-sm px-6 py-3 rounded-full transition-colors disabled:opacity-40";
  const styles =
    variant === "primary"
      ? "bg-brand-gold text-brand-black hover:bg-brand-gold-dim"
      : "border border-brand-gold text-brand-gold hover:bg-brand-gold/10";

  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}
