import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  title?: string;
  accent?: string;
};

export default function GeekCard({
  children,
  title,
  accent = "var(--accent)",
  className = "",
  ...props
}: Props) {
  return (
    <div
      className={`rounded-lg border border-[var(--border)] bg-[var(--terminal)] overflow-hidden ${className}`}
      {...props}
    >
      {title && (
        <div
          className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[#0a0a12]"
          style={{ borderLeft: `3px solid ${accent}` }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
          <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">
            {title}
          </span>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
