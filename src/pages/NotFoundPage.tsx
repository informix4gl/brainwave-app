import { Link } from "react-router-dom";
import { useLanguage } from "../i18n";
import { GeekButton } from "../components/ui";

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 px-4 py-24">
      <pre className="text-[var(--accent)] text-xs sm:text-sm font-mono">
{`  _  _    ___    ______  _____  _  _
 | || |  / _ \\  |  ____|/ ____|| || |
 | || |_| | | | | |__  | (___  | || |_
 |__   _| | | | |  __|  \\___ \\ |__   _|
    | | | |_| | | |     ____) |   | |
    |_|  \\___/  |_|    |_____/    |_|`}
      </pre>
      <p className="font-mono text-sm text-[var(--muted)]">
        <span className="text-[var(--accent)]">$</span> ls ./page
      </p>
      <p className="font-mono text-sm text-red-400">{t("404.error")}</p>
      <Link to="/">
        <GeekButton variant="secondary" size="sm">
          {t("404.home")}
        </GeekButton>
      </Link>
    </div>
  );
}
