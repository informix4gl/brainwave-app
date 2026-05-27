"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { useLanguage } from "../../i18n";

export default function CollapsibleText({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const { locale } = useLanguage();
  const moreText = locale === "zh" ? "更多" : "More";
  const lessText = locale === "zh" ? "收起" : "Less";

  const checkOverflow = useCallback(() => {
    const el = contentRef.current;
    if (!el || expandedRef.current) return;
    if (el.scrollHeight > el.clientHeight) {
      setOverflow(true);
    }
  }, []);

  // Measure on mount and when children change (e.g., language switch)
  useLayoutEffect(() => {
    setOverflow(false);
    // rAF ensures the browser has completed layout with line-clamp applied
    const raf = requestAnimationFrame(checkOverflow);
    return () => cancelAnimationFrame(raf);
  }, [children, checkOverflow]);

  // Re-measure on container resize (e.g., window resize)
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(checkOverflow);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [checkOverflow]);

  return (
    <div>
      <div
        ref={contentRef}
        className={expanded ? "" : "line-clamp-2"}
      >
        {children}
      </div>
      {overflow && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-[var(--accent)] hover:underline cursor-pointer font-mono text-[13px]"
        >
          {expanded ? lessText : moreText}
        </button>
      )}
    </div>
  );
}
