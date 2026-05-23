/* ── Genre Metadata + BPM Dual Anti-Interference Audit Engine ──
 *
 *  Replaces naive filename matching with ID3 metadata genre inspection
 *  and Web Audio API BPM detection to flag high-interference tracks that
 *  undermine deep entrainment states (Delta, Theta, Alpha).
 *
 *  Two-layer audit:
 *    Layer 1 — Genre Blacklist: Rap, Hiphop, Rock, Metal, Punk, Dubstep, etc.
 *    Layer 2 — BPM Threshold:   > 120 BPM = high-interference rhythm track
 *
 *  Blocked states: Delta, Theta, Alpha (deep meditation / focus / sleep)
 *  Permitted states: Beta, Gamma (naturally aligned with high-energy music)
 */

import type { BrainwaveState } from "./brainwaveFrequencies";

/* ── Blacklist ── */

const INTERFERENCE_GENRES = new Set([
  "rap",
  "hiphop",
  "hip-hop",
  "hip hop",
  "rock",
  "metal",
  "punk",
  "dubstep",
  "drum and bass",
  "drum & bass",
  "dnb",
  "hardcore",
  "hardstyle",
  "trap",
  "drill",
  "grime",
  "industrial",
  "screamo",
  "death metal",
  "black metal",
  "thrash",
  "speed metal",
  "heavy metal",
]);

const INTERFERENCE_BPM_THRESHOLD = 120;

/** Brainwave states that conflict with high-interference audio */
const PROTECTED_STATES: Set<BrainwaveState> = new Set([
  "delta",
  "theta",
  "alpha",
]);

/* ── Types ── */

export interface InterferenceInfo {
  /** Overall interference severity */
  level: "warning" | "danger";
  /** Genre blacklist hits */
  genreHits: string[];
  /** BPM that triggered (0 if none) */
  bpmValue: number;
  /** Whether BPM exceeded threshold */
  bpmTriggered: boolean;
}

export interface InterferenceResult {
  /** Which brainwave states this track should NOT be loaded into */
  blockedStates: BrainwaveState[];
  /** Detailed interference info (null = clean) */
  info: InterferenceInfo | null;
}

/* ── Detection ── */

/** Check if a genre string hits the blacklist */
function matchGenreBlacklist(genre: string): string[] {
  const lower = genre.toLowerCase().trim();
  const hits: string[] = [];

  for (const blocked of INTERFERENCE_GENRES) {
    if (lower.includes(blocked) || blocked.includes(lower)) {
      hits.push(blocked);
    }
  }

  // Word-level fuzzy: split genre by common delimiters
  if (hits.length === 0) {
    const words = lower.split(/[\s\-_/,;&]+/);
    for (const blocked of INTERFERENCE_GENRES) {
      for (const word of words) {
        if (word === blocked || (word.length > 2 && blocked.includes(word))) {
          hits.push(blocked);
        }
      }
    }
  }

  return [...new Set(hits)];
}

export function detectInterference(
  metadata?: { genre?: string; bpm?: number } | null,
  features?: { detectedBpm: number } | null,
): InterferenceResult {
  const genreHits: string[] = [];
  let bpmTriggered = false;
  let bpmValue = 0;

  // Layer 1: Genre blacklist
  if (metadata?.genre) {
    const hits = matchGenreBlacklist(metadata.genre);
    genreHits.push(...hits);
  }

  // Layer 2: BPM threshold (prefer features.detectedBpm over metadata.bpm)
  if (features?.detectedBpm) {
    bpmValue = features.detectedBpm;
    bpmTriggered = bpmValue > INTERFERENCE_BPM_THRESHOLD;
  } else if (metadata?.bpm) {
    bpmValue = metadata.bpm;
    bpmTriggered = bpmValue > INTERFERENCE_BPM_THRESHOLD;
  }

  const hasInterference = genreHits.length > 0 || bpmTriggered;

  if (!hasInterference) {
    return { blockedStates: [], info: null };
  }

  // Determine severity: genre + BPM both hit = danger
  const level =
    genreHits.length > 0 && bpmTriggered ? "danger" : "warning";

  return {
    blockedStates: [...PROTECTED_STATES],
    info: {
      level,
      genreHits,
      bpmValue,
      bpmTriggered,
    },
  };
}

/** Quick check: should this track be blocked for a given brainwave state? */
export function isBlockedForState(
  interference: InterferenceResult | null,
  state: BrainwaveState,
): boolean {
  if (!interference || interference.blockedStates.length === 0) return false;
  return interference.blockedStates.includes(state);
}

/** Human-readable genre label for display */
export function formatGenreHit(genre: string): string {
  return genre.charAt(0).toUpperCase() + genre.slice(1);
}
