/* ── Tauri File Scanner + Multi-Signal Brainwave Matching ── */

import { invoke } from "@tauri-apps/api/core";
import type { BrainwaveState } from "./brainwaveFrequencies";
import {
  BRAINWAVE_STATES,
  BRAINWAVE_ORDER,
  TEMPO_TO_BRAINWAVE,
  GENRE_TO_BRAINWAVE,
  type Genre,
} from "./brainwaveFrequencies";
import type { AudioFeatures, AudioMetadata } from "./audioAnalyzer";
export { analyzeAudioFeatures } from "./audioAnalyzer";
export type { AudioFeatures, AudioMetadata } from "./audioAnalyzer";
import { detectInterference, type InterferenceInfo, type InterferenceResult } from "./interferenceDetector";
export type { InterferenceInfo, InterferenceResult } from "./interferenceDetector";

export interface AudioFileInfo {
  name: string;
  path: string;
  extension: string;
  metadata?: AudioMetadata | null;
}

export type ScoredBrainwave = {
  state: BrainwaveState;
  score: number;
};

export interface ScoredFile extends AudioFileInfo {
  brainwave: BrainwaveState;
  score: number;
  reason: string;
  allScores: ScoredBrainwave[];
  metadata?: AudioMetadata | null;
  features?: AudioFeatures | null;
  interference?: InterferenceResult | null;
}

/* ── Tauri Command Wrappers ── */

export async function scanDirectory(
  directory: string,
): Promise<AudioFileInfo[]> {
  return invoke<AudioFileInfo[]>("scan_audio_files", { directory });
}

export async function readAudioMetadata(
  filePath: string,
): Promise<AudioMetadata | null> {
  return invoke<AudioMetadata | null>("read_audio_metadata", {
    filePath,
  });
}

/* ── Keyword → Brainwave Mapping ── */

type KeywordRule = {
  keywords: string[];
  state: BrainwaveState;
  label: string;
};

const KEYWORD_RULES: KeywordRule[] = [
  {
    keywords: ["sleep", "deep", "healing", "insomnia", "dream", "rest"],
    state: "delta",
    label: "Sleep / Healing keywords",
  },
  {
    keywords: [
      "meditation", "meditate", "zen", "yoga", "spa",
      "theta", "creative", "spiritual", "chant", "mantra",
      "nature", "rain", "ocean", "water", "forest", "bird",
    ],
    state: "theta",
    label: "Meditation / Nature keywords",
  },
  {
    keywords: [
      "lofi", "lo-fi", "chill", "relax", "relaxing", "calm",
      "ambient", "soft", "smooth", "peace", "peaceful", "mellow",
      "study", "read", "reading", "coffee", "cafe",
      "jazz", "classical", "piano", "acoustic", "strings",
    ],
    state: "alpha",
    label: "Relax / Chill / Study keywords",
  },
  {
    keywords: [
      "focus", "concentrate", "work", "coding", "programming",
      "productivity", "active", "upbeat", "motivation", "hustle",
      "pop", "dance", "funk", "groove",
    ],
    state: "beta",
    label: "Focus / Active / Upbeat keywords",
  },
  {
    keywords: [
      "workout", "gym", "exercise", "energy", "energetic",
      "rock", "metal", "electronic", "edm", "bass",
      "cyber", "cyberpunk", "synth", "industrial", "hard",
      "intense", "power", "epic", "battle", "action",
    ],
    state: "gamma",
    label: "Energy / Rock / Electronic keywords",
  },
];

/* ── Keyword Scoring (existing) ── */

export function scoreFile(filename: string): ScoredFile["brainwave"] | null {
  const lower = filename.toLowerCase();
  let best: { state: BrainwaveState; score: number; rule: string } | null =
    null;

  for (const rule of KEYWORD_RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) {
        score += 1;
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { state: rule.state, score, rule: rule.label };
    }
  }

  return best ? best.state : null;
}

/* ── Mapping: Genre string → Brainwave states ── */

function genreToBrainwaveStates(genre: string): BrainwaveState[] {
  const lower = genre.toLowerCase().trim();
  const genreKeys = Object.keys(GENRE_TO_BRAINWAVE) as Genre[];

  // Direct: genre string contains known key or vice versa
  for (const key of genreKeys) {
    const label = key.toLowerCase();
    if (lower.includes(label) || label.includes(lower)) {
      return GENRE_TO_BRAINWAVE[key];
    }
  }

  // Fuzzy: word-level overlap
  const words = lower.split(/[\s\-_/]+/);
  for (const key of genreKeys) {
    const label = key.toLowerCase();
    for (const word of words) {
      if (word.length > 2 && label.includes(word)) {
        return GENRE_TO_BRAINWAVE[key];
      }
    }
  }

  return [];
}

/* ── Mapping: BPM → Brainwave states ── */

function bpmToBrainwaveStates(bpm: number): BrainwaveState[] {
  const ranges: { tempo: keyof typeof TEMPO_TO_BRAINWAVE; min: number; max: number }[] = [
    { tempo: "very-slow", min: 40, max: 60 },
    { tempo: "slow", min: 60, max: 90 },
    { tempo: "moderate", min: 90, max: 120 },
    { tempo: "fast", min: 120, max: 150 },
    { tempo: "very-fast", min: 150, max: 220 },
  ];

  for (const r of ranges) {
    if (bpm >= r.min && bpm < r.max) {
      return TEMPO_TO_BRAINWAVE[r.tempo];
    }
  }

  return [];
}

/* ── Mapping: Spectral Centroid → Brainwave states ── */

function centroidToBrainwaveStates(centroidHz: number): BrainwaveState[] {
  if (centroidHz < 400) return ["delta", "theta"];
  if (centroidHz < 800) return ["theta", "alpha"];
  if (centroidHz < 1500) return ["alpha", "beta"];
  if (centroidHz < 3000) return ["beta", "gamma"];
  return ["gamma"];
}

/* ── Mapping: Energy distribution → Brainwave states ── */

function energyToBrainwaveStates(
  low: number,
  mid: number,
  high: number,
): BrainwaveState[] {
  if (low >= mid && low >= high) return ["delta", "theta"];
  if (high >= low && high >= mid) return ["beta", "gamma"];
  return ["alpha", "beta"];
}

/* ── Combined Multi-Signal Scoring ── */

const SCORE_WEIGHTS = {
  keyword: 1.0,
  metadataGenre: 1.5,
  metadataBpm: 1.5,
  audioBpm: 2.0,
  audioCentroid: 1.5,
  audioEnergy: 1.5,
};

function computeBrainwaveScores(
  filename: string,
  metadata?: AudioMetadata | null,
  features?: AudioFeatures | null,
): {
  state: BrainwaveState;
  score: number;
  reasonParts: string[];
  allScores: ScoredBrainwave[];
} {
  const scores: Record<BrainwaveState, number> = {
    delta: 0,
    theta: 0,
    alpha: 0,
    beta: 0,
    gamma: 0,
  };
  const reasonParts: string[] = [];

  // Source 1: Keyword match
  const keywordState = scoreFile(filename);
  if (keywordState) {
    scores[keywordState] += SCORE_WEIGHTS.keyword;
    reasonParts.push(`Keyword → ${keywordState}`);
  }

  // Source 2: ID3 metadata
  if (metadata) {
    if (metadata.genre) {
      const genreStates = genreToBrainwaveStates(metadata.genre);
      for (const s of genreStates) scores[s] += SCORE_WEIGHTS.metadataGenre;
      if (genreStates.length > 0) {
        reasonParts.push(
          `ID3 genre:"${metadata.genre}" → ${genreStates.join("/")}`,
        );
      }
    }
    if (metadata.bpm) {
      const bpmStates = bpmToBrainwaveStates(metadata.bpm);
      for (const s of bpmStates) scores[s] += SCORE_WEIGHTS.metadataBpm;
      if (bpmStates.length > 0) {
        reasonParts.push(`ID3 BPM:${metadata.bpm} → ${bpmStates.join("/")}`);
      }
    }
  }

  // Source 3: Audio features
  if (features) {
    const audioBpmStates = bpmToBrainwaveStates(features.detectedBpm);
    for (const s of audioBpmStates) scores[s] += SCORE_WEIGHTS.audioBpm;
    reasonParts.push(
      `Audio BPM:${features.detectedBpm} → ${audioBpmStates.join("/") || "none"}`,
    );

    const centroidStates = centroidToBrainwaveStates(
      features.spectralCentroid,
    );
    for (const s of centroidStates) scores[s] += SCORE_WEIGHTS.audioCentroid;
    reasonParts.push(
      `Centroid:${Math.round(features.spectralCentroid)}Hz → ${centroidStates.join("/")}`,
    );

    const energyStates = energyToBrainwaveStates(
      features.energyLow,
      features.energyMid,
      features.energyHigh,
    );
    for (const s of energyStates) scores[s] += SCORE_WEIGHTS.audioEnergy;
    reasonParts.push(
      `Energy L:${(features.energyLow * 100).toFixed(0)}% M:${(features.energyMid * 100).toFixed(0)}% H:${(features.energyHigh * 100).toFixed(0)}% → ${energyStates.join("/")}`,
    );
  }

  // Find best state
  let bestState: BrainwaveState = "alpha";
  let bestScore = -1;
  for (const s of BRAINWAVE_ORDER) {
    if (scores[s] > bestScore) {
      bestScore = scores[s];
      bestState = s;
    }
  }

  const allScores: ScoredBrainwave[] = BRAINWAVE_ORDER.map((s) => ({
    state: s,
    score: scores[s],
  })).sort((a, b) => b.score - a.score);

  if (bestScore <= 0) {
    return {
      state: "alpha",
      score: 0,
      reasonParts: ["No signals — default alpha"],
      allScores,
    };
  }

  return { state: bestState, score: bestScore, reasonParts, allScores };
}

/* ── Analysis functions ── */

export function analyzeFile(
  file: AudioFileInfo,
  features?: AudioFeatures | null,
): ScoredFile {
  const { state, score, reasonParts, allScores } = computeBrainwaveScores(
    file.name,
    file.metadata,
    features,
  );

  // Run dual-audit interference detection
  const interference = detectInterference(file.metadata, features);

  // If interference is detected and the recommended brainwave is blocked,
  // fall back to the highest-scoring non-blocked state
  let finalState = state;
  if (interference.blockedStates.includes(state)) {
    for (const scored of allScores) {
      if (!interference.blockedStates.includes(scored.state)) {
        finalState = scored.state;
        break;
      }
    }
    // If all states blocked, keep original but note interference
  }

  const cfg = BRAINWAVE_STATES[finalState];
  const reason =
    reasonParts.length > 0
      ? reasonParts.join(" | ")
      : `No signals — default ${cfg.name} (${cfg.freqMin}–${cfg.freqMax} Hz)`;

  return {
    ...file,
    brainwave: finalState,
    score,
    reason,
    allScores,
    features: features ?? null,
    interference: interference.info ? interference : null,
  };
}

export function analyzeFileList(files: AudioFileInfo[]): ScoredFile[] {
  return files
    .map((f) => analyzeFile(f))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

/* ── Read file bytes via Rust command (supports UNC/network paths) ── */

export async function readAudioFile(
  filePath: string,
): Promise<Uint8Array> {
  const bytes = await invoke<number[]>("read_audio_file_bytes", { filePath });
  return new Uint8Array(bytes);
}
