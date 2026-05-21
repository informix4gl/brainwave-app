import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, useTheme } from "../../i18n";
import GlitchText from "../ui/GlitchText";

const FONT_SIZE_KEY = "brainsync-fontsize";
const DEFAULT_FONT_SIZE = 14;
const FONT_SIZE_MIN = 10;
const FONT_SIZE_MAX = 25;

function loadFontSize(): number {
  if (typeof window === "undefined") return DEFAULT_FONT_SIZE;
  const stored = localStorage.getItem(FONT_SIZE_KEY);
  const n = stored ? Number(stored) : NaN;
  return n >= FONT_SIZE_MIN && n <= FONT_SIZE_MAX ? n : DEFAULT_FONT_SIZE;
}

function applyFontSize(px: number) {
  document.documentElement.style.setProperty("--font-size", `${px}px`);
}

export default function AppHeader() {
  const { t, toggleLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [fontSize, setFontSize] = useState(loadFontSize);
  const { pathname } = useLocation();

  useEffect(() => {
    applyFontSize(fontSize);
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
  }, [fontSize]);

  return (
    <header className="border-b border-[var(--border)] bg-[var(--terminal)]/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold font-mono text-[var(--accent)] tracking-tight">
            <GlitchText>{t("app.title")}</GlitchText>
          </span>
          <span className="hidden sm:inline text-xs font-mono text-[var(--muted)]">
            {t("app.tagline")}
          </span>

          <Link
            to={pathname === "/about" ? "/" : "/about"}
            className="px-2 py-1 text-xs font-mono border border-[var(--border)] rounded text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all cursor-pointer no-underline"
          >
            {pathname === "/about" ? t("nav.studio") : t("nav.about")}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Font size slider */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-[var(--muted)]/60">
              A
            </span>
            <input
              type="range"
              min={FONT_SIZE_MIN}
              max={FONT_SIZE_MAX}
              step={1}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-16 h-1.5 rounded-full appearance-none cursor-pointer bg-[var(--border)]
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--accent)] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
              title={`Font size: ${fontSize}px`}
            />
            <span className="text-xs font-mono text-[var(--muted)]/60">
              A
            </span>
            <span className="text-[10px] font-mono text-[var(--muted)]/50 tabular-nums w-7">
              {fontSize}
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="px-2 py-1 text-xs font-mono border border-[var(--border)] rounded text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all cursor-pointer"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? t("theme.light") : t("theme.dark")}
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            className="px-2 py-1 text-xs font-mono border border-[var(--border)] rounded text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all cursor-pointer"
            title="Switch language / 切换语言"
          >
            {t("lang.switch")}
          </button>
        </div>
      </div>
    </header>
  );
}
