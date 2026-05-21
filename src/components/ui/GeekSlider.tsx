import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  valueDisplay?: string;
  hint?: string;
  onHint?: () => void;
};

export default function GeekSlider({
  label,
  valueDisplay,
  hint,
  onHint,
  className = "",
  id,
  ...props
}: Props) {
  const sliderId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {(label ?? valueDisplay !== undefined) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {label && (
              <label
                htmlFor={sliderId}
                className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider"
              >
                {label}
              </label>
            )}
            {hint && onHint && (
              <button
                type="button"
                onClick={onHint}
                className="text-[11px] font-mono text-[var(--muted)]/60 hover:text-[var(--accent)] border border-[var(--border)] hover:border-[var(--accent)]/30 rounded px-1.5 py-px transition-colors cursor-pointer"
                title={hint}
              >
                {hint}
              </button>
            )}
          </div>
          {valueDisplay !== undefined && (
            <span className="text-xs font-mono text-[var(--accent)] tabular-nums">
              {valueDisplay}
            </span>
          )}
        </div>
      )}
      <input
        id={sliderId}
        type="range"
        className={`w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--border)]
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:shadow-[0_0_8px_var(--accent)] [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--accent)] [&::-moz-range-thumb]:shadow-[0_0_8px_var(--accent)] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0
          ${className}`}
        {...props}
      />
    </div>
  );
}
