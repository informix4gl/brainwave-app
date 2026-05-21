import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

const base =
  "inline-flex items-center justify-center gap-2 font-mono border transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none";

const variants = {
  primary:
    "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10 hover:shadow-[0_0_12px_var(--accent)]",
  secondary:
    "border-[var(--border)] text-[var(--foreground)] bg-[var(--card)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)]",
  ghost:
    "border-transparent text-[var(--muted)] bg-transparent hover:text-[var(--accent)]",
};

const sizes = {
  sm: "px-3 py-1 text-xs rounded",
  md: "px-4 py-2 text-sm rounded-md",
  lg: "px-6 py-3 text-base rounded-lg",
};

export default function GeekButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
