"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { useBrainSync } from "../context/BrainSyncContext";
import { BRAINWAVE_STATES } from "../utils/brainwaveFrequencies";
import type { NatureSoundType } from "../utils/audioEngine";
import { save } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { GeekButton, GeekSlider } from "./ui";

const NATURE_TYPES: NatureSoundType[] = ["ocean", "rain", "stream", "pink", "brown", "white"];

export default function AudioPlayer() {
  const { t } = useLanguage();
  const { selectedState, customFreq, setCarrierFreq, setNatureType } = useBrainSync();
  const {
    status,
    error,
    carrierFreq,
    carrierVol,
    musicVol,
    noiseVol,
    natureType,
    analyserRef,
    hasAudio,
    play,
    pause,
    resume,
    stop,
    setCarrierFrequency,
    setCarrierVolume,
    setMusicVolume,
    setNoiseVolume,
    setNatureSoundType,
    exportAudio,
  } = useAudioEngine();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [openAfterExport, setOpenAfterExport] = useState(true);

  const handleCarrierFreqChange = (f: number) => {
    setCarrierFrequency(f);
    setCarrierFreq(f);
  };

  const handleNatureTypeChange = (t: NatureSoundType) => {
    setNatureSoundType(t);
    setNatureType(t);
  };

  const stateColor = BRAINWAVE_STATES[selectedState].color;
  const freqRange = BRAINWAVE_STATES[selectedState];

  /* ── FFT Visualization ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const W = canvas.width;
    const H = canvas.height;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteFrequencyData(dataArray);

    ctx2d.clearRect(0, 0, W, H);

    const barCount = 48;
    const barWidth = (W / barCount) * 0.7;
    const gap = (W / barCount) * 0.3;
    const step = Math.floor(bufferLength / barCount);

    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i * step] ?? 0;
      const barHeight = (value / 255) * H * 0.85;
      const x = i * (barWidth + gap);
      const y = H - barHeight;

      // Gradient from state color to transparent
      const gradient = ctx2d.createLinearGradient(0, H, 0, 0);
      gradient.addColorStop(0, stateColor + "40");
      gradient.addColorStop(0.6, stateColor + "cc");
      gradient.addColorStop(1, stateColor);

      ctx2d.fillStyle = gradient;
      ctx2d.fillRect(x, y, barWidth, barHeight);
    }

    animRef.current = requestAnimationFrame(draw);
  }, [analyserRef, stateColor]);

  useEffect(() => {
    if (status !== "playing") {
      // Clear canvas on stop/pause/idle
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx2d = canvas.getContext("2d");
        if (ctx2d) ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw, status]);

  /* ── Canvas resize ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ── Export ── */
  const translateProgress = (msg: string) => {
    if (msg === "rendering") return t("audio.export.rendering");
    if (msg.startsWith("encoding:")) return t("audio.export.encoding") + msg.slice(8);
    if (msg === "assembling") return t("audio.export.assembling");
    return msg;
  };

  const handleExport = async (format: "wav" | "mp3") => {
    setExporting(true);
    setExportProgress(null);
    setExportSuccess(null);
    setExportError(null);
    try {
      const blob = await exportAudio(
        selectedState,
        customFreq,
        format,
        (msg) => setExportProgress(translateProgress(msg)),
      );
      if (!blob) {
        setExportProgress(null);
        return;
      }

      setExportProgress(t("audio.export.saving"));
      const ext = format === "mp3" ? "mp3" : "wav";
      const defaultName = `brainsync-${selectedState}-${Date.now()}.${ext}`;
      const filePath = await save({
        defaultPath: defaultName,
        filters: [{ name: "Audio", extensions: [ext] }],
      });

      if (!filePath) {
        setExportProgress(null);
        return;
      }

      const bytes = Array.from(new Uint8Array(await blob.arrayBuffer()));
      await invoke("write_file_bytes", { path: filePath, bytes });

      if (openAfterExport) {
        invoke("open_in_explorer", { path: filePath }).catch(() => {});
      }

      const fileName = filePath.replace(/\\/g, "/").split("/").pop() ?? defaultName;
      setExportProgress(null);
      setExportSuccess(`${t("audio.export.exported")} → ${fileName}`);
      setTimeout(() => setExportSuccess(null), 6000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("Export failed:", msg);
      setExportProgress(null);
      setExportError(msg);
      setTimeout(() => setExportError(null), 8000);
    } finally {
      setExporting(false);
    }
  };

  const isPlaying = status === "playing";
  const isPaused = status === "paused";
  const isIdle = status === "idle";

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--terminal)] p-4">
      {/* Title bar */}
      <div
        className="flex items-center gap-2 pb-3 border-b border-[var(--border)]"
        style={{ borderLeft: `3px solid ${stateColor}` }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: stateColor,
            boxShadow:
              isPlaying
                ? `0 0 8px ${stateColor}`
                : isPaused
                  ? `0 0 4px ${stateColor}`
                  : "none",
            animation: isPlaying ? "blink 1s step-end infinite" : "none",
          }}
        />
        <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">
          {t("audio.title")}
        </span>
        <span className="text-xs font-mono text-[var(--accent)] ml-auto">
          {freqRange.symbol} {freqRange.freqMin}–{freqRange.freqMax} Hz
        </span>
      </div>

      {/* FFT Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-20 rounded border border-[var(--border)] bg-[var(--background)]"
      />

      {/* Status & Error */}
      {error && (
        <div className="text-xs font-mono text-red-400 bg-red-400/5 border border-red-400/20 rounded px-3 py-1.5">
          [{error}]
        </div>
      )}

      {/* Transport Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {isIdle && (
          <GeekButton
            size="sm"
            onClick={() => play(selectedState, customFreq)}
          >
            {t("audio.play")}
          </GeekButton>
        )}
        {isPlaying && (
          <GeekButton size="sm" variant="secondary" onClick={pause}>
            {t("audio.pause")}
          </GeekButton>
        )}
        {isPaused && (
          <GeekButton size="sm" onClick={resume}>
            {t("audio.resume")}
          </GeekButton>
        )}
        {!isIdle && (
          <GeekButton size="sm" variant="ghost" onClick={stop}>
            {t("audio.stop")}
          </GeekButton>
        )}

        <span className="text-xs font-mono text-[var(--muted)] ml-2">
          {isIdle && t("audio.idle")}
          {isPlaying && t("audio.playing")}
          {isPaused && t("audio.paused")}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        {/* Row 1: Carrier Frequency + Carrier Volume */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <GeekSlider
              label={t("audio.carrierFrequency")}
              valueDisplay={`${carrierFreq} Hz`}
              hint={t("audio.recommended")}
              onHint={() => handleCarrierFreqChange(320)}
              min={100}
              max={500}
              step={1}
              value={carrierFreq}
              onChange={(e) => handleCarrierFreqChange(Number(e.target.value))}
            />
            <p className="text-[15px] font-mono text-[var(--muted)]/50 mt-1 leading-relaxed">
              {t("audio.carrierFrequencyHelp")}
            </p>
          </div>
          <div>
            <GeekSlider
              label={t("audio.carrierVolume")}
              valueDisplay={`${Math.round(carrierVol * 100)}%`}
              hint={t("audio.recommended")}
              onHint={() => setCarrierVolume(0.25)}
              min={0}
              max={1}
              step={0.01}
              value={carrierVol}
              onChange={(e) => setCarrierVolume(Number(e.target.value))}
            />
            <p className="text-[15px] font-mono text-[var(--muted)]/50 mt-1 leading-relaxed">
              {t("audio.carrierVolumeHelp")}
            </p>
          </div>
        </div>

        {/* Row 2: Nature Sound Type Selector */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <label className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">
              {t("audio.natureSoundType")}
            </label>
            <button
              type="button"
              onClick={() => handleNatureTypeChange("brown")}
              className="text-[11px] font-mono text-[var(--muted)]/60 hover:text-[var(--accent)] border border-[var(--border)] hover:border-[var(--accent)]/30 rounded px-1.5 py-px transition-colors cursor-pointer"
            >
              {t("audio.recommended")}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {NATURE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleNatureTypeChange(type)}
                className={`px-3 py-1 text-xs font-mono rounded border transition-all cursor-pointer ${
                  natureType === type
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/30"
                }`}
              >
                {t(`audio.natureType.${type}` as never)}
              </button>
            ))}
          </div>
          <p className="text-[15px] font-mono text-[var(--muted)]/50 mt-1 leading-relaxed">
            {t("audio.natureTypeHelp")}
          </p>
        </div>

        {/* Row 3: Nature Volume + Music Volume */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <GeekSlider
              label={t("audio.natureSoundVolume")}
              valueDisplay={`${Math.round(noiseVol * 100)}%`}
              hint={t("audio.recommended")}
              onHint={() => setNoiseVolume(0.20)}
              min={0}
              max={1}
              step={0.01}
              value={noiseVol}
              onChange={(e) => setNoiseVolume(Number(e.target.value))}
            />
            <p className="text-[15px] font-mono text-[var(--muted)]/50 mt-1 leading-relaxed">
              {t("audio.natureSoundVolumeHelp")}
            </p>
          </div>
          <div>
            <GeekSlider
              label={t("audio.musicVolume")}
              valueDisplay={`${Math.round(musicVol * 100)}%`}
              hint={t("audio.recommended")}
              onHint={() => setMusicVolume(0.70)}
              min={0}
              max={1}
              step={0.01}
              value={musicVol}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              disabled={!hasAudio}
            />
            <p className="text-[15px] font-mono text-[var(--muted)]/50 mt-1 leading-relaxed">
              {t("audio.musicVolumeHelp")}
            </p>
          </div>
        </div>
      </div>

      {/* Cautions */}
      <div className="pt-2 border-t border-[var(--border)] space-y-1">
        <p className="text-[13px] font-mono text-amber-400/70 leading-relaxed">
          {t("audio.warning.headphones")}
        </p>
        <p className="text-[13px] font-mono text-[var(--muted)]/50 leading-relaxed">
          {t("audio.warning.carrierMin")}
        </p>
      </div>

      {/* Export */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <GeekButton
            size="sm"
            variant="secondary"
            onClick={() => handleExport("wav")}
            disabled={exporting || !hasAudio}
          >
            {exporting ? t("audio.exporting") : t("audio.exportWav")}
          </GeekButton>
          <GeekButton
            size="sm"
            variant="secondary"
            onClick={() => handleExport("mp3")}
            disabled={exporting || !hasAudio}
          >
            {t("audio.exportMp3")}
          </GeekButton>
          {!hasAudio && (
            <span className="text-[15px] font-mono text-[var(--muted)]">
              {t("audio.uploadHint")}
            </span>
          )}
          {hasAudio && (
            <label className="flex items-center gap-1.5 ml-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={openAfterExport}
                onChange={(e) => setOpenAfterExport(e.target.checked)}
                className="w-3 h-3 accent-[var(--accent)] cursor-pointer"
              />
              <span className="text-[13px] font-mono text-[var(--muted)]/70">
                {t("audio.exportOpenFolder")}
              </span>
            </label>
          )}
        </div>
        {exportProgress && (
          <p className="text-xs font-mono text-[var(--accent)]/80 leading-relaxed animate-pulse">
            <span className="text-[var(--accent)]">$</span> {exportProgress}
          </p>
        )}
        {exportSuccess && (
          <p className="text-xs font-mono text-green-400/80 leading-relaxed">
            <span className="text-green-400">$</span> exported → {exportSuccess}
          </p>
        )}
        {exportError && (
          <p className="text-xs font-mono text-red-400/80 leading-relaxed">
            <span className="text-red-400">!</span> {exportError}
          </p>
        )}
      </div>
    </div>
  );
}
