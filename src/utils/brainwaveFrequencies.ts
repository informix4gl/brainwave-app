/* ── Brainwave Core Logic ── */

export type BrainwaveState = "delta" | "theta" | "alpha" | "beta" | "gamma";

export type Mood =
  | "relaxing"
  | "energetic"
  | "meditative"
  | "focus"
  | "sleep"
  | "happy"
  | "sad"
  | "calm"
  | "anxious";

export type Tempo = "very-slow" | "slow" | "moderate" | "fast" | "very-fast";

export type Genre =
  | "classical"
  | "ambient"
  | "lofi"
  | "jazz"
  | "electronic"
  | "rock"
  | "pop"
  | "meditation"
  | "nature";

/* ── Brainwave State Config ── */

export interface BrainwaveStateConfig {
  id: BrainwaveState;
  name: string;
  nameZh: string;
  symbol: string;
  freqMin: number;
  freqMax: number;
  defaultFreq: number;
  color: string;
  description: string;
  descriptionZh: string;
  benefits: string[];
  benefitsZh: string[];
}

export const BRAINWAVE_STATES: Record<BrainwaveState, BrainwaveStateConfig> = {
  delta: {
    id: "delta",
    name: "Delta",
    nameZh: "Delta 波",
    symbol: "δ",
    freqMin: 0.5,
    freqMax: 4,
    defaultFreq: 2,
    color: "#7c3aed",
    description:
      "Deep dreamless sleep, physical healing, and unconscious awareness.",
    descriptionZh: "深度无梦睡眠、身体修复与潜意识觉察。",
    benefits: ["Deep sleep", "Healing", "Pain relief"],
    benefitsZh: ["深度睡眠", "身体修复", "疼痛缓解"],
  },
  theta: {
    id: "theta",
    name: "Theta",
    nameZh: "Theta 波",
    symbol: "θ",
    freqMin: 4,
    freqMax: 8,
    defaultFreq: 6,
    color: "#3b82f6",
    description:
      "Meditation, creativity, light sleep, and emotional processing.",
    descriptionZh: "冥想状态、创造力、浅层睡眠与情绪处理。",
    benefits: ["Meditation", "Creativity", "Emotional healing"],
    benefitsZh: ["冥想放松", "创造力提升", "情绪疗愈"],
  },
  alpha: {
    id: "alpha",
    name: "Alpha",
    nameZh: "Alpha 波",
    symbol: "α",
    freqMin: 8,
    freqMax: 13,
    defaultFreq: 10,
    color: "#22c55e",
    description:
      "Relaxed alertness, calm focus, and the bridge between conscious and subconscious.",
    descriptionZh: "放松警觉、平静专注，意识与潜意识的桥梁。",
    benefits: ["Calm focus", "Stress relief", "Learning"],
    benefitsZh: ["平静专注", "减压放松", "学习记忆"],
  },
  beta: {
    id: "beta",
    name: "Beta",
    nameZh: "Beta 波",
    symbol: "β",
    freqMin: 13,
    freqMax: 30,
    defaultFreq: 20,
    color: "#f59e0b",
    description:
      "Active thinking, concentration, problem-solving, and alert wakefulness.",
    descriptionZh: "积极思考、专注集中、问题解决与警觉清醒。",
    benefits: ["Concentration", "Problem solving", "Energy"],
    benefitsZh: ["高度专注", "问题解决", "精力充沛"],
  },
  gamma: {
    id: "gamma",
    name: "Gamma",
    nameZh: "Gamma 波",
    symbol: "γ",
    freqMin: 30,
    freqMax: 50,
    defaultFreq: 40,
    color: "#ec4899",
    description:
      "Peak focus, information processing, cognitive enhancement, and insight.",
    descriptionZh: "巅峰专注、信息整合、认知增强与顿悟体验。",
    benefits: ["Peak focus", "Memory", "Insight"],
    benefitsZh: ["巅峰专注", "记忆力", "顿悟洞察"],
  },
};

/* ── Mood → Brainwave Mapping ── */

export const MOOD_TO_BRAINWAVE: Record<Mood, BrainwaveState[]> = {
  relaxing: ["alpha", "theta"],
  energetic: ["beta", "gamma"],
  meditative: ["theta", "alpha"],
  focus: ["beta", "gamma"],
  sleep: ["delta", "theta"],
  happy: ["alpha", "beta"],
  sad: ["theta", "alpha"],
  calm: ["alpha", "theta"],
  anxious: ["alpha", "beta"],
};

export const MOOD_LABELS: Record<Mood, { en: string; zh: string }> = {
  relaxing: { en: "Relaxing", zh: "放松" },
  energetic: { en: "Energetic", zh: "活力" },
  meditative: { en: "Meditative", zh: "冥想" },
  focus: { en: "Focus", zh: "专注" },
  sleep: { en: "Sleep", zh: "睡眠" },
  happy: { en: "Happy", zh: "快乐" },
  sad: { en: "Sad", zh: "悲伤" },
  calm: { en: "Calm", zh: "平静" },
  anxious: { en: "Anxious", zh: "焦虑" },
};

/* ── Tempo → Brainwave Mapping ── */

export const TEMPO_TO_BRAINWAVE: Record<Tempo, BrainwaveState[]> = {
  "very-slow": ["delta", "theta"],
  slow: ["theta", "alpha"],
  moderate: ["alpha", "beta"],
  fast: ["beta", "gamma"],
  "very-fast": ["gamma", "beta"],
};

export const TEMPO_LABELS: Record<Tempo, { en: string; zh: string; bpm: string }> = {
  "very-slow": { en: "Very Slow", zh: "极慢", bpm: "40–60 BPM" },
  slow: { en: "Slow", zh: "慢速", bpm: "60–90 BPM" },
  moderate: { en: "Moderate", zh: "中速", bpm: "90–120 BPM" },
  fast: { en: "Fast", zh: "快速", bpm: "120–150 BPM" },
  "very-fast": { en: "Very Fast", zh: "极快", bpm: "150+ BPM" },
};

/* ── Genre → Brainwave Mapping ── */

export const GENRE_TO_BRAINWAVE: Record<Genre, BrainwaveState[]> = {
  classical: ["alpha", "theta"],
  ambient: ["theta", "delta"],
  lofi: ["alpha", "theta"],
  jazz: ["alpha", "beta"],
  electronic: ["beta", "gamma"],
  rock: ["beta", "gamma"],
  pop: ["beta", "alpha"],
  meditation: ["theta", "delta"],
  nature: ["delta", "theta"],
};

export const GENRE_LABELS: Record<Genre, { en: string; zh: string }> = {
  classical: { en: "Classical", zh: "古典" },
  ambient: { en: "Ambient", zh: "氛围" },
  lofi: { en: "LoFi", zh: "LoFi" },
  jazz: { en: "Jazz", zh: "爵士" },
  electronic: { en: "Electronic", zh: "电子" },
  rock: { en: "Rock", zh: "摇滚" },
  pop: { en: "Pop", zh: "流行" },
  meditation: { en: "Meditation", zh: "冥想" },
  nature: { en: "Nature", zh: "自然" },
};

/* ── Utilities ── */

export function getFrequencyRange(
  state: BrainwaveState
): { min: number; max: number } {
  const cfg = BRAINWAVE_STATES[state];
  return { min: cfg.freqMin, max: cfg.freqMax };
}

export function getDefaultFrequency(state: BrainwaveState): number {
  return BRAINWAVE_STATES[state].defaultFreq;
}

export function clampFrequency(state: BrainwaveState, freq: number): number {
  const { min, max } = getFrequencyRange(state);
  return Math.max(min, Math.min(max, freq));
}

/**
 * Intersection-based match: find brainwave states common to all selected sets.
 * Falls back to a frequency-ranked union if no intersection exists.
 */
export function matchBrainwaveStates(
  moodStates: BrainwaveState[],
  tempoStates: BrainwaveState[],
  genreStates: BrainwaveState[]
): BrainwaveState[] {
  // Try intersection
  const intersection = moodStates.filter(
    (s) => tempoStates.includes(s) && genreStates.includes(s)
  );
  if (intersection.length > 0) return intersection;

  // Frequency-ranked union fallback
  const freq: Record<string, number> = {};
  for (const s of [...moodStates, ...tempoStates, ...genreStates]) {
    freq[s] = (freq[s] ?? 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([s]) => s as BrainwaveState);
}

/** All 5 states in frequency order */
export const BRAINWAVE_ORDER: BrainwaveState[] = [
  "delta",
  "theta",
  "alpha",
  "beta",
  "gamma",
];
