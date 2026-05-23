"use client";

import { useEffect } from "react";
import { useLanguage } from "../i18n";
import { useBrainSync } from "../context/BrainSyncContext";
import {
  BRAINWAVE_STATES,
  getFrequencyRange,
  clampFrequency,
  type BrainwaveState,
} from "../utils/brainwaveFrequencies";
import { audioEngine } from "../utils/audioEngine";
import { GeekCard, GeekSlider } from "../components/ui";
import FileBrowser from "../components/FileBrowser";
import SongRecommendations from "../components/SongRecommendations";
import AudioPlayer from "../components/AudioPlayer";

export default function GeneratePage() {
  const { t, locale } = useLanguage();
  const { selectedState, setSelectedState, customFreq, setCustomFreq, carrierFreq } =
    useBrainSync();

  const range = getFrequencyRange(selectedState);
  const isZh = locale === "zh";
  const s = BRAINWAVE_STATES[selectedState];

  const onCustomFreqChange = (v: number) => {
    setCustomFreq(clampFrequency(selectedState, v));
  };

  const freq = customFreq ?? s.defaultFreq;

  // Keyboard shortcuts
  useEffect(() => {
    const stateKeys: Record<string, BrainwaveState> = {
      "1": "delta",
      "2": "theta",
      "3": "alpha",
      "4": "beta",
      "5": "gamma",
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (stateKeys[e.key]) {
        e.preventDefault();
        setSelectedState(stateKeys[e.key]);
        return;
      }

      if (e.key === " ") {
        e.preventDefault();
        const st = audioEngine.status;
        if (st === "idle") audioEngine.play(selectedState, customFreq);
        else if (st === "playing") audioEngine.pause();
        else if (st === "paused") audioEngine.resume();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        audioEngine.stop();
      }

      // Q key toggles Quantum Sync Pro-Mode
      if (e.key === "q" || e.key === "Q") {
        e.preventDefault();
        audioEngine.setAdvancedSyncEnabled(!audioEngine.advancedEnabled);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedState, customFreq, setSelectedState]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Info banner */}
      <div className="mb-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] font-mono text-[18px] text-[var(--muted)]">
        <span className="text-purple-400">$</span> {t("generate.banner.cmd")}
        <br />
        <span className="text-[var(--muted)]/60">
          {t("generate.banner.step1")}{"  "}
          {t("generate.banner.step2")}
          <br />
          {t("generate.banner.step3")}{"  "}
          {t("generate.banner.step4")}
          <br />
          <span className="text-[var(--accent)]/50">
            {t("generate.shortcuts")}
          </span>
        </span>
      </div>

      {/* Step 1: File Browser — full width */}
      <GeekCard title={t("fileBrowser.title")} className="mb-6">
        <FileBrowser />
      </GeekCard>

      {/* Step 2 + 3: Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left column: Brainwave selector + AudioPlayer */}
        <div className="flex flex-col gap-4">
          <GeekCard title={t("generate.selectorTitle")}>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(BRAINWAVE_STATES) as BrainwaveState[]).map((key) => {
                const cfg = BRAINWAVE_STATES[key];
                const active = selectedState === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedState(key)}
                    className={`text-left px-3 py-2 rounded border font-mono text-xs transition-all cursor-pointer ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/30"
                    }`}
                    style={
                      active
                        ? { boxShadow: `0 0 6px ${cfg.color}40` }
                        : undefined
                    }
                  >
                    <span style={{ color: cfg.color }}>{cfg.symbol}</span>{" "}
                    {isZh ? cfg.nameZh : cfg.name}
                    <span className="block text-[15px] opacity-60">
                      {cfg.freqMin}–{cfg.freqMax} Hz
                    </span>
                  </button>
                );
              })}
            </div>
          </GeekCard>

          <AudioPlayer />
        </div>

        {/* Right column: detail + slider + binaural + songs */}
        <div className="flex flex-col gap-4">
          <GeekCard title={t("generate.detailTitle")}>
            <div className="space-y-4">
              {/* Selected state info */}
              <div
                className="p-3 rounded border text-xs font-mono"
                style={{
                  borderColor: s.color + "40",
                  background: s.color + "08",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: s.color }}>{s.symbol}</span>
                  <span className="text-[var(--foreground)] font-bold">
                    {isZh ? s.nameZh : s.name}
                  </span>
                </div>
                <p className="text-[var(--muted)] leading-relaxed text-[18px]">
                  {isZh ? s.descriptionZh : s.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(isZh ? s.benefitsZh : s.benefits).map((b) => (
                    <span
                      key={b}
                      className="px-1.5 py-0.5 rounded text-[15px] bg-[var(--accent)]/10 text-[var(--accent)]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Custom frequency slider */}
              <div className="pt-2 border-t border-[var(--border)]">
                <GeekSlider
                  label={t("generate.customFrequency")}
                  valueDisplay={`${freq} Hz`}
                  min={range.min}
                  max={range.max}
                  step={0.1}
                  value={freq}
                  onChange={(e) => onCustomFreqChange(Number(e.target.value))}
                />
              </div>

              {/* Binaural Beat Explanation */}
              <div className="pt-2 border-t border-[var(--border)]">
                <h4 className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider mb-2">
                  {t("binaural.title")}
                </h4>
                <div className="text-[18px] font-mono text-[var(--muted)] space-y-2 leading-relaxed">
                  <p>
                    <span className="text-[var(--accent)]">{t("binaural.leftEar")}:</span>{" "}
                    {carrierFreq} Hz {t("binaural.carrier")}
                    <span className="mx-2 text-[var(--muted)]/40">|</span>
                    <span className="text-[var(--accent)]">{t("binaural.rightEar")}:</span>{" "}
                    {carrierFreq} + <span style={{ color: s.color }}>{freq}</span> Hz
                  </p>
                  <p>
                    <span className="text-[var(--accent)]">→</span>{" "}
                    {t("binaural.perceives")}{" "}
                    <span className="font-bold" style={{ color: s.color }}>
                      {freq} Hz {isZh ? s.nameZh : s.name}
                    </span>{" "}
                    {t("binaural.binauralBeat")}
                  </p>
                  <p className="text-[15px] text-[var(--muted)]/60">
                    {t("binaural.headphones")}
                  </p>
                </div>
              </div>
            </div>
          </GeekCard>

          <SongRecommendations />
        </div>
      </div>
    </div>
  );
}
