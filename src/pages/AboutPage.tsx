"use client";

import { useLanguage } from "../i18n";
import { GeekCard, CollapsibleText } from "../components/ui";

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
        <CollapsibleText>
          <p className="text-[18px] text-[var(--muted)] leading-relaxed">
            {t("about.tagline")}
          </p>
        </CollapsibleText>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* What is it */}
        <GeekCard title={t("about.what")}>
          <div className="text-[18px] font-mono text-[var(--muted)] space-y-3 leading-relaxed">
            <CollapsibleText><p>{t("about.whatDesc")}</p></CollapsibleText>
            <CollapsibleText><p>{t("about.whatDesc2")}</p></CollapsibleText>
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
              <span>{t("about.featQuantumSync")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] mt-0.5">▶</span>
              <span>{t("about.featSyncNodes")}</span>
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
            <CollapsibleText><p>{t("about.howDesc1")}</p></CollapsibleText>
            <CollapsibleText><p>{t("about.howDesc2")}</p></CollapsibleText>
            <CollapsibleText><p>{t("about.howDesc3")}</p></CollapsibleText>
            <CollapsibleText><p>{t("about.howDesc4")}</p></CollapsibleText>
            <CollapsibleText><p>{t("about.howDesc5")}</p></CollapsibleText>
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

      {/* Acknowledgments */}
      <div className="mt-8 p-5 rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/[0.03]">
        <h2 className="text-xs font-mono text-[var(--accent)] uppercase tracking-wider mb-3">
          ♥ {t("about.thanks")}
        </h2>
        <CollapsibleText>
          <p className="text-[18px] font-mono text-[var(--muted)] leading-relaxed">
            {t("about.thanksDesc")}
          </p>
        </CollapsibleText>
      </div>

      {/* Footer note */}
      <div className="mt-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] text-center">
        <CollapsibleText>
          <p className="text-[18px] font-mono text-[var(--muted)]">
            {t("about.disclaimer")}
          </p>
        </CollapsibleText>
      </div>
    </div>
  );
}
