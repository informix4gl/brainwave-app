import { Outlet } from "react-router-dom";
import { useLanguage } from "../../i18n";
import AppHeader from "./AppHeader";
import ScanlineOverlay from "../ui/ScanlineOverlay";

export default function AppLayout() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <ScanlineOverlay />
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--border)] px-6 py-4 text-center">
        <p className="text-[18px] font-mono text-[var(--muted)]">
          {t("app.footer")}{" "}
          <span className="text-[var(--accent)]/40">
            {t("app.tagline")}
          </span>
          {" "}
          <span className="text-[var(--accent)]/30">
            {t("app.developer")}
          </span>
        </p>
      </footer>
    </div>
  );
}
