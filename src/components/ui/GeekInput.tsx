import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function GeekInput({
  label,
  error,
  className = "",
  id,
  ...props
}: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`font-mono text-sm bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] px-3 py-2 rounded-md outline-none transition-all placeholder:text-[var(--muted)]/50 focus:border-[var(--accent)] focus:shadow-[0_0_8px_var(--accent)] ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs font-mono text-red-400">[{error}]</span>
      )}
    </div>
  );
}
