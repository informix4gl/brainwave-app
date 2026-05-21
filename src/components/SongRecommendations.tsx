"use client";

import { useLanguage } from "../i18n";
import { useBrainSync } from "../context/BrainSyncContext";
import { BRAINWAVE_STATES } from "../utils/brainwaveFrequencies";
import {
  getSongsByBrainwaveState,
  getGenreLabel,
} from "../data/songRecommendations";

export default function SongRecommendations() {
  const { t, locale } = useLanguage();
  const { selectedState } = useBrainSync();

  const stateCfg = BRAINWAVE_STATES[selectedState];
  const songs = getSongsByBrainwaveState(selectedState);
  const isZh = locale === "zh";

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--terminal)] overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] bg-[#0a0a12]"
        style={{ borderLeft: `3px solid ${stateCfg.color}` }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: stateCfg.color }}
        />
        <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">
          {t("songs.title")}
        </span>
        <span
          className="text-[10px] font-mono ml-auto"
          style={{ color: stateCfg.color }}
        >
          {stateCfg.symbol} {isZh ? stateCfg.nameZh : stateCfg.name} · {songs.length}{" "}
          {t("songs.songs")}
        </span>
      </div>

      {songs.length === 0 ? (
        /* No recommendations fallback */
        <div className="px-4 py-8 text-center">
          <div className="text-[18px] font-mono text-[var(--muted)]/60 mb-2">
            <span style={{ color: stateCfg.color }}>$</span> ls ~/songs/
            {stateCfg.id}/
          </div>
          <div className="text-[18px] font-mono text-[var(--muted)]/40">
            <span className="text-red-400/60">[err]</span>{" "}
            {t("songs.noRecs")}
          </div>
          <div className="text-[15px] font-mono text-[var(--muted)]/30 mt-2">
            {t("songs.switchHint")}
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {songs.map((song) => (
              <div
                key={song.id}
                className="group p-3 rounded border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/30 transition-all"
                style={{
                  boxShadow: `0 0 0 0 ${stateCfg.color}00`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = stateCfg.color + "60";
                  e.currentTarget.style.boxShadow = `0 0 10px ${stateCfg.color}18`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Title + Artist row */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-[var(--foreground)] font-bold truncate group-hover:text-[var(--accent)] transition-colors">
                      {song.title}
                    </div>
                    <div className="text-[15px] font-mono text-[var(--muted)]/60 mt-0.5">
                      {t("songs.by")} {song.artist}
                    </div>
                  </div>
                  <span
                    className="shrink-0 px-1.5 py-0.5 rounded text-[15px] font-mono border"
                    style={{
                      color: stateCfg.color,
                      background: stateCfg.color + "10",
                      borderColor: stateCfg.color + "30",
                    }}
                  >
                    {getGenreLabel(song.genre, locale)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[15px] font-mono text-[var(--muted)]/50 leading-relaxed line-clamp-2 group-hover:text-[var(--muted)]/70 transition-colors">
                  {isZh ? song.descriptionZh : song.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
