"use client";

import { useState } from "react";
import { useLanguage } from "../../i18n";

export default function CollapsibleText({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const { locale } = useLanguage();
  const moreText = locale === "zh" ? "更多" : "More";
  const lessText = locale === "zh" ? "收起" : "Less";

  return (
    <div>
      <div className={expanded ? "" : "line-clamp-2"}>{children}</div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-[var(--accent)] hover:underline cursor-pointer font-mono text-[13px]"
      >
        {expanded ? lessText : moreText}
      </button>
    </div>
  );
}
