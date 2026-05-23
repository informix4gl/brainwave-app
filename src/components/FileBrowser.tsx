"use client";

import { useCallback, useState, type DragEvent } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { useLanguage } from "../i18n";
import { useBrainSync } from "../context/BrainSyncContext";
import { useAudioEngine } from "../hooks/useAudioEngine";
import { audioEngine } from "../utils/audioEngine";
import type { ScoredFile, ScoredBrainwave } from "../utils/fileScanner";
import {
  scanDirectory,
  analyzeFileList,
  analyzeFile,
  readAudioFile,
  readAudioMetadata,
} from "../utils/fileScanner";
import {
  analyzeAudioFeatures,
  type AudioFeatures,
  type AudioMetadata,
} from "../utils/audioAnalyzer";
import { BRAINWAVE_STATES } from "../utils/brainwaveFrequencies";
import { GeekButton, GeekInput } from "./ui";

const AUDIO_FILTER = {
  name: "Audio",
  extensions: ["mp3", "wav", "flac", "ogg", "aac", "m4a", "wma", "opus"],
};

const RECENT_FILES_KEY = "brainsync-recent-files";
const MAX_RECENT = 8;

interface RecentFile {
  name: string;
  path: string;
  extension: string;
}

function loadRecentFiles(): RecentFile[] {
  try {
    const raw = localStorage.getItem(RECENT_FILES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentFiles(files: RecentFile[]) {
  localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(files));
}

export default function FileBrowser() {
  const { t } = useLanguage();
  const { selectedState, setSelectedState, handleFileSelect, setInterference } = useBrainSync();
  const { status, stop, loadAudio } = useAudioEngine();

  const [dirPath, setDirPath] = useState("");
  const [files, setFiles] = useState<ScoredFile[]>([]);
  const [scanning, setScanning] = useState(false);
  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadedPath, setLoadedPath] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<ScoredBrainwave[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>(loadRecentFiles);

  const addToRecent = useCallback((f: RecentFile) => {
    setRecentFiles((prev) => {
      const next = [f, ...prev.filter((r) => r.path !== f.path)].slice(0, MAX_RECENT);
      saveRecentFiles(next);
      return next;
    });
  }, []);

  /* ── Browse Folder ── */
  const handleBrowseFolder = async () => {
    const folder = await open({ directory: true, multiple: false });
    if (!folder) return;
    setDirPath(folder);
    // Auto-scan after picking
    await doScan(folder);
  };

  /* ── Browse Single File ── */
  const handleBrowseFile = async () => {
    const filePath = await open({
      filters: [AUDIO_FILTER],
      multiple: false,
    });
    if (!filePath) return;

    // Extract dir and filename from full path
    const cleaned = filePath.replace(/\\/g, "/");
    const lastSlash = cleaned.lastIndexOf("/");
    const dir = cleaned.slice(0, lastSlash);
    const nameWithExt = cleaned.slice(lastSlash + 1);
    const dotIdx = nameWithExt.lastIndexOf(".");
    const name = dotIdx > 0 ? nameWithExt.slice(0, dotIdx) : nameWithExt;
    const ext = dotIdx > 0 ? nameWithExt.slice(dotIdx + 1) : "";

    // Set dir path and scan the parent folder
    setDirPath(dir);
    await doScan(dir);

    // Auto-load the picked file
    setLoadingFile(name);
    setError(null);
    try {
      const data = await readAudioFile(filePath);
      const blob = new Blob([data as unknown as BlobPart]);
      const jsFile = new File([blob], nameWithExt, {
        type: `audio/${ext}`,
      });
      await loadAudio(jsFile);
      handleFileSelect(jsFile);

      // Combined analysis: metadata + audio features
      const metadata = await readAudioMetadata(filePath);
      let features: AudioFeatures | null = null;
      if (audioEngine.audioBuffer) {
        const buffer = audioEngine.audioBuffer;
        features = await new Promise<AudioFeatures>((resolve, reject) => {
          setTimeout(() => {
            try {
              resolve(analyzeAudioFeatures(buffer));
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
      const scored = analyzeFile(
        { name, path: filePath, extension: ext, metadata },
        features,
      );
      setSelectedState(scored.brainwave);
      setRecommendations(scored.allScores);
      setInterference(scored.interference ?? null);
      setLoadedPath(filePath);
      addToRecent({ name, path: filePath, extension: ext });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("fileBrowser.loadFailed"));
    }
    setLoadingFile(null);
  };

  /* ── Scan ── */
  const doScan = async (path: string) => {
    setScanning(true);
    setError(null);
    try {
      const raw = await scanDirectory(path);
      const scored = analyzeFileList(raw);
      setFiles(scored);
      if (scored.length === 0) {
        setError(t("fileBrowser.noFiles"));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t("fileBrowser.scanFailed"));
    }
    setScanning(false);
  };

  const handleScan = () => {
    if (!dirPath.trim()) return;
    doScan(dirPath.trim());
  };

  const handleLoadFile = async (file: ScoredFile) => {
    if (status !== "idle") stop();
    setLoadingFile(file.name);
    setError(null);
    try {
      const data = await readAudioFile(file.path);
      const blob = new Blob([data as unknown as BlobPart]);
      const jsFile = new File([blob], file.name, {
        type: `audio/${file.extension}`,
      });
      await loadAudio(jsFile);
      handleFileSelect(jsFile);

      // Run audio feature analysis for combined scoring
      let features: AudioFeatures | null = null;
      if (audioEngine.audioBuffer) {
        const buffer = audioEngine.audioBuffer;
        features = await new Promise<AudioFeatures>((resolve, reject) => {
          setTimeout(() => {
            try {
              resolve(analyzeAudioFeatures(buffer));
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
      const scored = analyzeFile(
        { name: file.name, path: file.path, extension: file.extension, metadata: file.metadata },
        features,
      );
      setSelectedState(scored.brainwave);
      setRecommendations(scored.allScores);
      setInterference(scored.interference ?? null);

      // Update reason in table row with refined result
      setFiles((prev) =>
        prev.map((f) =>
          f.path === file.path
            ? { ...f, score: scored.score, reason: scored.reason }
            : f,
        ),
      );

      setLoadedPath(file.path);
      addToRecent({ name: file.name, path: file.path, extension: file.extension });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("fileBrowser.loadFailed"));
    }
    setLoadingFile(null);
  };

  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    const nameWithExt = droppedFile.name;
    const dotIdx = nameWithExt.lastIndexOf(".");
    const name = dotIdx > 0 ? nameWithExt.slice(0, dotIdx) : nameWithExt;
    const ext = dotIdx > 0 ? nameWithExt.slice(dotIdx + 1) : "";
    const lowerExt = ext.toLowerCase();
    const validExts = ["mp3", "wav", "flac", "ogg", "aac", "m4a", "wma", "opus"];
    if (!validExts.includes(lowerExt)) return;

    // Get the file path from Tauri's extended File API
    const filePath = (droppedFile as unknown as { path?: string }).path;
    if (filePath) {
      const cleaned = filePath.replace(/\\/g, "/");
      const lastSlash = cleaned.lastIndexOf("/");
      const dir = cleaned.slice(0, lastSlash);
      setDirPath(dir);
      await doScan(dir);
    }

    if (status !== "idle") stop();
    setLoadingFile(name);
    setError(null);
    try {
      const blob = new Blob([droppedFile as unknown as BlobPart]);
      const jsFile = new File([blob], nameWithExt, { type: `audio/${ext}` });
      await loadAudio(jsFile);
      handleFileSelect(jsFile);

      // Full analysis: metadata + audio features + interference
      let metadata: AudioMetadata | null = null;
      if (filePath) {
        metadata = await readAudioMetadata(filePath);
      }
      let features: AudioFeatures | null = null;
      if (audioEngine.audioBuffer) {
        features = await new Promise<AudioFeatures>((resolve, reject) => {
          setTimeout(() => {
            try { resolve(analyzeAudioFeatures(audioEngine.audioBuffer!)); }
            catch (e) { reject(e); }
          }, 0);
        });
      }
      const scored = analyzeFile(
        { name, path: filePath ?? nameWithExt, extension: ext, metadata },
        features,
      );
      setInterference(scored.interference ?? null);

      setLoadedPath(filePath ?? nameWithExt);
      if (filePath) addToRecent({ name, path: filePath, extension: ext });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("fileBrowser.loadFailed"));
    }
    setLoadingFile(null);
  };

  return (
    <div
      className={`flex flex-col gap-4 ${dragOver ? "ring-2 ring-[var(--accent)]/50 rounded-lg" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Scan bar — two rows */}
      <div className="flex flex-col gap-2 p-4 rounded-lg border border-[var(--border)] bg-[var(--terminal)]">
        {/* Row 1: folder path input + scan */}
        <div className="flex items-center gap-2">
          <GeekInput
            placeholder={t("fileBrowser.placeholder")}
            value={dirPath}
            onChange={(e) => setDirPath(e.target.value)}
            className="flex-1"
          />
          <GeekButton size="sm" onClick={handleScan} disabled={scanning}>
            {scanning ? t("fileBrowser.scanning") : t("fileBrowser.scan")}
          </GeekButton>
        </div>
        {/* Row 2: browse buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleBrowseFolder}
            className="px-3 py-1.5 text-xs font-mono border border-[var(--border)] rounded text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all cursor-pointer"
          >
            {t("fileBrowser.browseFolder")}
          </button>
          <button
            onClick={handleBrowseFile}
            className="px-3 py-1.5 text-xs font-mono border border-dashed border-[var(--border)] rounded text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all cursor-pointer"
          >
            {t("fileBrowser.browseFile")}
          </button>
          <span className="text-[15px] font-mono text-[var(--muted)]/40 hidden sm:inline">
            {t("fileBrowser.hint")}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start justify-between gap-3 text-xs font-mono text-red-400 bg-red-400/5 border border-red-400/20 rounded px-3 py-2">
          <span className="flex-1">[{error}]</span>
          <button
            onClick={() => {
              setError(null);
              if (dirPath.trim()) doScan(dirPath.trim());
            }}
            className="shrink-0 px-2 py-0.5 text-xs font-mono border border-red-400/30 rounded text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
          >
            retry
          </button>
        </div>
      )}

      {/* Recent files */}
      {recentFiles.length > 0 && (
        <div className="rounded-lg border border-[var(--accent)]/15 bg-[var(--accent)]/[0.02] p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[15px] font-mono text-[var(--muted)]/60 uppercase tracking-wider">
              <span className="text-[var(--accent)]">$</span> {t("fileBrowser.recent")}
            </div>
            <button
              onClick={() => {
                localStorage.removeItem(RECENT_FILES_KEY);
                setRecentFiles([]);
              }}
              className="px-1.5 py-0.5 text-[10px] font-mono border border-[var(--border)] rounded text-[var(--muted)]/50 hover:text-red-400 hover:border-red-400/30 transition-colors cursor-pointer"
            >
              {t("fileBrowser.recentClear")}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentFiles.map((rf) => (
              <button
                key={rf.path}
                onClick={async () => {
                  if (status !== "idle") stop();
                  setLoadingFile(rf.name);
                  setError(null);
                  try {
                    const data = await readAudioFile(rf.path);
                    const blob = new Blob([data as unknown as BlobPart]);
                    const jsFile = new File([blob], rf.name, {
                      type: `audio/${rf.extension}`,
                    });
                    await loadAudio(jsFile);
                    handleFileSelect(jsFile);

                    // Analysis + interference detection
                    const meta = await readAudioMetadata(rf.path);
                    let feats: AudioFeatures | null = null;
                    if (audioEngine.audioBuffer) {
                      feats = await new Promise<AudioFeatures>((resolve, reject) => {
                        setTimeout(() => {
                          try { resolve(analyzeAudioFeatures(audioEngine.audioBuffer!)); }
                          catch (e) { reject(e); }
                        }, 0);
                      });
                    }
                    const sc = analyzeFile(
                      { name: rf.name, path: rf.path, extension: rf.extension, metadata: meta },
                      feats,
                    );
                    setInterference(sc.interference ?? null);

                    setLoadedPath(rf.path);
                    addToRecent(rf);
                  } catch (e) {
                    setError(e instanceof Error ? e.message : t("fileBrowser.loadFailed"));
                  }
                  setLoadingFile(null);
                }}
                disabled={loadingFile === rf.name}
                className="px-2 py-1 rounded text-[10px] font-mono border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all cursor-pointer truncate max-w-[240px]"
                title={rf.path}
              >
                {rf.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File count */}
      {files.length > 0 && (
        <div className="text-xs font-mono text-[var(--muted)]">
          <span className="text-[var(--accent)]">$</span>{" "}
          {t("fileBrowser.found")} {files.length}{" "}
          {t("fileBrowser.audioFile")}
          {loadedPath && (
            <>
              {" "}
              <span className="text-[var(--muted)]/40">|</span>{" "}
              <span className="text-[var(--accent)]">{t("fileBrowser.loaded")}:</span>{" "}
              {loadedPath}
            </>
          )}
        </div>
      )}

      {/* File table */}
      {files.length > 0 && (
        <div className="rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-xs font-mono">
              <thead className="sticky top-0 bg-[var(--terminal)] border-b border-[var(--border)]">
                <tr className="text-[var(--muted)] uppercase tracking-wider">
                  <th className="text-left px-3 py-2 w-8">{t("fileBrowser.colIndex")}</th>
                  <th className="text-left px-3 py-2">{t("fileBrowser.colName")}</th>
                  <th className="text-left px-3 py-2 hidden sm:table-cell">
                    {t("fileBrowser.colType")}
                  </th>
                  <th className="text-left px-3 py-2">{t("fileBrowser.colBrainwave")}</th>
                  <th className="text-left px-3 py-2 hidden md:table-cell">
                    {t("fileBrowser.colReason")}
                  </th>
                  <th className="text-center px-3 py-2 w-20">{t("fileBrowser.colLoad")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {files.map((file, i) => {
                  const cfg = BRAINWAVE_STATES[file.brainwave];
                  const isLoading = loadingFile === file.name;
                  const isLoaded = loadedPath === file.path;
                  return (
                    <tr
                      key={file.path}
                      className={`transition-colors ${
                        isLoaded
                          ? "bg-[var(--accent)]/5"
                          : "hover:bg-[var(--accent)]/[0.02]"
                      }`}
                    >
                      <td className="px-3 py-2 text-[var(--muted)]/50">
                        {i + 1}
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-[var(--foreground)] truncate max-w-[180px]">
                          {file.name}
                        </div>
                        <div className="text-[10px] text-[var(--muted)]/50 truncate max-w-[180px] sm:hidden">
                          .{file.extension}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[var(--muted)]/60 hidden sm:table-cell">
                        .{file.extension}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
                            style={{
                              background: cfg.color + "18",
                              color: cfg.color,
                              border: `1px solid ${cfg.color}30`,
                            }}
                          >
                            {cfg.symbol} {cfg.name}
                          </span>
                          {file.interference?.info && (
                            <span
                              className="px-1 py-0.5 rounded text-[10px] font-mono border"
                              style={{
                                color: file.interference.info.level === "danger" ? "#f87171" : "#fbbf24",
                                background: file.interference.info.level === "danger" ? "#f8717120" : "#fbbf2420",
                                borderColor: file.interference.info.level === "danger" ? "#f8717140" : "#fbbf2440",
                              }}
                              title={t("interference.tableWarning")}
                            >
                              !
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[var(--muted)]/60 hidden md:table-cell text-[10px] max-w-[200px] truncate">
                        {file.reason}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleLoadFile(file)}
                          disabled={isLoading}
                          className={`px-2 py-1 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                            isLoaded
                              ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
                              : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
                          }`}
                        >
                          {isLoading
                            ? "..."
                            : isLoaded
                              ? t("fileBrowser.loadedStatus")
                              : t("fileBrowser.load")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Brainwave Recommendations — shown after loading a file */}
      {recommendations.length > 0 && (
        <div className="p-3 rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/[0.03]">
          <div className="text-[15px] font-mono text-[var(--muted)] uppercase tracking-wider mb-2">
            <span className="text-[var(--accent)]">$</span>{" "}
            {t("fileBrowser.recommendations")}
            <span className="text-[var(--muted)]/40 ml-2">{t("fileBrowser.clickToSwitch")}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recommendations.map((r) => {
              const cfg = BRAINWAVE_STATES[r.state];
              const isSelected = r.state === selectedState;
              return (
                <button
                  key={r.state}
                  onClick={() => {
                    setSelectedState(r.state);
                    // Find the loaded file and update its brainwave
                    const f = files.find((f) => f.path === loadedPath);
                    if (f) {
                      setFiles((prev) =>
                        prev.map((pf) =>
                          pf.path === loadedPath
                            ? { ...pf, brainwave: r.state }
                            : pf,
                        ),
                      );
                    }
                  }}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--foreground)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/30 hover:text-[var(--foreground)]"
                  }`}
                  style={
                    isSelected
                      ? { boxShadow: `0 0 6px ${cfg.color}40` }
                      : undefined
                  }
                >
                  <span style={{ color: cfg.color }}>{cfg.symbol}</span>
                  <span>{cfg.name}</span>
                  <span className="text-[var(--muted)]/40">
                    {r.score > 0 ? `${r.score.toFixed(1)}` : "—"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
