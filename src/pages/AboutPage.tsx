"use client";

import { useLanguage } from "../i18n";
import { GeekCard } from "../components/ui";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-8 p-6 rounded-lg border border-[var(--border)] bg-[var(--card)] font-mono">
        <pre className="text-[var(--accent)] text-xs leading-tight mb-4">
{`  ██████╗ ██████╗  █████╗ ██╗███╗   ██╗███████╗██╗   ██╗███╗   ██╗ ██████╗
  ██╔══██╗██╔══██╗██╔══██╗██║████╗  ██║██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝
  ██████╔╝██████╔╝███████║██║██╔██╗ ██║███████╗ ╚████╔╝ ██╔██╗ ██║██║
  ██╔══██╗██╔══██╗██╔══██║██║██║╚██╗██║╚════██║  ╚██╔╝  ██║╚██╗██║██║
  ██████╔╝██║  ██║██║  ██║██║██║ ╚████║███████║   ██║   ██║ ╚████║╚██████╗
  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═══╝ ╚═════╝`}
        </pre>
        <p className="text-[18px] text-[var(--muted)] leading-relaxed">
          {t("about.tagline")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* What is it */}
        <GeekCard title={t("about.what")}>
          <div className="text-[18px] font-mono text-[var(--muted)] space-y-3 leading-relaxed">
            <p>{t("about.whatDesc")}</p>
            <p>{t("about.whatDesc2")}</p>
          </div>
        </GeekCard>

        {/* Features */}
        <GeekCard title={t("about.features")}>
          <ul className="text-[18px] font-mono text-[var(--muted)] space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] mt-0.5">▶</span>
              <span>{t("about.featBrainwave")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] mt-0.5">▶</span>
              <span>{t("about.featScan")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] mt-0.5">▶</span>
              <span>{t("about.featAnalysis")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] mt-0.5">▶</span>
              <span>{t("about.featVisualizer")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] mt-0.5">▶</span>
              <span>{t("about.featExport")}</span>
            </li>
          </ul>
        </GeekCard>

        {/* How it works */}
        <GeekCard title={t("about.how")}>
          <div className="text-[18px] font-mono text-[var(--muted)] space-y-2 leading-relaxed">
            <p>{t("about.howDesc1")}</p>
            <p>{t("about.howDesc2")}</p>
            <p>{t("about.howDesc3")}</p>
          </div>
        </GeekCard>

        {/* Tech stack */}
        <GeekCard title={t("about.tech")}>
          <div className="text-[18px] font-mono space-y-1.5">
            {[
              { k: "Tauri", v: "v2" },
              { k: "React", v: "v18" },
              { k: "TypeScript", v: "" },
              { k: "Tailwind CSS", v: "v4" },
              { k: "Web Audio API", v: "" },
              { k: "Rust", v: "" },
            ].map(({ k, v }) => (
              <div key={k} className="flex items-center gap-2">
                <span className="text-[var(--accent)] w-24">{k}</span>
                <span className="text-[var(--muted)]/60">{v}</span>
              </div>
            ))}
          </div>
        </GeekCard>
      </div>

      {/* Footer note */}
      <div className="mt-8 p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] text-center">
        <p className="text-[18px] font-mono text-[var(--muted)]">
          {t("about.disclaimer")}
        </p>
      </div>
    </div>
  );
}
