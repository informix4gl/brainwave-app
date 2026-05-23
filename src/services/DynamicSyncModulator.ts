/* ── Quantum Sync Dynamic Modulator ──
 *
 *  Advanced binaural entrainment algorithm that prevents neural habituation
 *  through micro-frequency sweeps, chaotic drift, configurable harmonics,
 *  amplitude modulation breathing, and sync-node presets.
 *
 *  Scientific codename: "Quantum Sync" — dynamic frequency modulation for
 *  sustained brainwave entrainment without adaptation plateau.
 *
 *  ── Signal Chain ──
 *  1. Base beat frequency (e.g. 10 Hz for Alpha)
 *  2. Sinusoidal micro-sweep   ±0.5 Hz, period ~37 s
 *  3. Chaotic drift            pseudo-random walk, bounded ±0.15 Hz
 *  4. Harmonic secondary       factor × primary → secondary beat
 *  5. AM breathing             slow LFO on carrier amplitude → tidal pulse
 */

const GOLDEN_RATIO = 0.6180339887498948;
const DEFAULT_SWEEP_AMPLITUDE = 0.5; // ±0.5 Hz
const DEFAULT_SWEEP_PERIOD = 37; // seconds per full sweep cycle
const DEFAULT_CHAOS_AMOUNT = 0.15; // max chaotic deviation in Hz
const DEFAULT_SECONDARY_FACTOR = 0.618; // harmonic multiplier
const DEFAULT_SECONDARY_GAIN = 0.5; // 0–1, gain for secondary beat layer
const DEFAULT_AM_DEPTH = 0.15; // 0–0.5, amplitude modulation depth
const DEFAULT_AM_RATE = 0.08; // Hz, ~12.5s breathing cycle

/* ── Sync Target Nodes ──
 *
 *  Node-10 "Somatic Hibernation"  →  deep body-asleep / mind-awake state
 *  Node-12 "Core Expansion"        →  expanded awareness / heightened perception
 *
 *  These are parameter presets inspired by neuroscience research on
 *  brainwave synchronization states, implemented with full deniability
 *  of any trademark association.
 */
export type SyncNode = "node-10" | "node-12";

export interface SyncNodePreset {
  label: string;
  subtitle: string;
  /** Recommended brainwave state */
  brainwave: string;
  /** AM breathing rate (Hz) */
  amRate: number;
  /** AM depth */
  amDepth: number;
  /** Harmonic factor multiplier */
  secondaryFactor: number;
  /** Sweep amplitude */
  sweepAmplitude: number;
}

export const SYNC_NODE_PRESETS: Record<SyncNode, SyncNodePreset> = {
  "node-10": {
    label: "Node-10",
    subtitle: "Somatic Hibernation",
    brainwave: "theta",
    amRate: 0.06, // ~16.7s cycle — very slow, tidal
    amDepth: 0.12,
    secondaryFactor: 0.618,
    sweepAmplitude: 0.4,
  },
  "node-12": {
    label: "Node-12",
    subtitle: "Core Expansion",
    brainwave: "alpha",
    amRate: 0.10, // ~10s cycle — gentle pulse
    amDepth: 0.25,
    secondaryFactor: 0.618,
    sweepAmplitude: 0.6,
  },
};

/**
 * Pseudo-chaotic generator using 4 incommensurate sine oscillators.
 * Produces a bounded, non-repeating slow drift signal — deterministic
 * enough for reproducibility, irregular enough to prevent habituation.
 */
function chaoticWalk(tSec: number): number {
  const c1 = Math.sin(2 * Math.PI * 0.023 * tSec + 0.7);
  const c2 = Math.sin(2 * Math.PI * 0.037 * tSec + 1.3);
  const c3 = Math.sin(2 * Math.PI * 0.053 * tSec + 2.1);
  const c4 = Math.sin(2 * Math.PI * 0.067 * tSec + 3.4);
  return (c1 * 0.5 + c2 * 0.35 + c3 * 0.25 + c4 * 0.15) / 1.15;
}

export class DynamicSyncModulator {
  private _baseFreq: number;
  private _sweepAmplitude: number;
  private _sweepPeriod: number;
  private _chaosAmount: number;
  private _secondaryFactor: number;
  private _amDepth: number;
  private _amRate: number;
  private _syncNode: SyncNode | null;

  constructor(baseFreq: number) {
    this._baseFreq = baseFreq;
    this._sweepAmplitude = DEFAULT_SWEEP_AMPLITUDE;
    this._sweepPeriod = DEFAULT_SWEEP_PERIOD;
    this._chaosAmount = DEFAULT_CHAOS_AMOUNT;
    this._secondaryFactor = DEFAULT_SECONDARY_FACTOR;
    this._amDepth = DEFAULT_AM_DEPTH;
    this._amRate = DEFAULT_AM_RATE;
    this._syncNode = null;
  }

  /* ── Getters / Setters ── */

  get baseFrequency(): number { return this._baseFreq; }
  setBaseFrequency(f: number): void { this._baseFreq = f; }

  get sweepAmplitude(): number { return this._sweepAmplitude; }
  setSweepAmplitude(a: number): void {
    this._sweepAmplitude = Math.max(0, Math.min(2, a));
  }

  get chaosAmount(): number { return this._chaosAmount; }
  setChaosAmount(c: number): void {
    this._chaosAmount = Math.max(0, Math.min(0.5, c));
  }

  get secondaryFactor(): number { return this._secondaryFactor; }
  setSecondaryFactor(f: number): void {
    this._secondaryFactor = Math.max(0.1, Math.min(1.5, f));
  }

  get amDepth(): number { return this._amDepth; }
  setAmDepth(d: number): void {
    this._amDepth = Math.max(0, Math.min(0.5, d));
  }

  get amRate(): number { return this._amRate; }
  setAmRate(r: number): void {
    this._amRate = Math.max(0.02, Math.min(0.5, r));
  }

  get syncNode(): SyncNode | null { return this._syncNode; }

  /* ── Sync Node Preset ── */
  applySyncNodePreset(node: SyncNode | null): void {
    this._syncNode = node;
    if (node) {
      const p = SYNC_NODE_PRESETS[node];
      this._amRate = p.amRate;
      this._amDepth = p.amDepth;
      this._secondaryFactor = p.secondaryFactor;
      this._sweepAmplitude = p.sweepAmplitude;
    }
  }

  /* ── Frequency Computation ── */

  /**
   * Effective primary beat frequency at time `tSec`.
   *   primary(t) = baseFreq + sweep(t) + chaos(t)
   */
  getPrimaryFreq(tSec: number): number {
    const sweep =
      this._sweepAmplitude *
      Math.sin((2 * Math.PI * tSec) / this._sweepPeriod);
    const chaos = this._chaosAmount * chaoticWalk(tSec);
    let freq = this._baseFreq + sweep + chaos;
    if (freq < 0.3) freq = 0.3;
    if (freq > 55) freq = 55;
    return freq;
  }

  /**
   * Secondary harmonic beat frequency.
   *   secondary(t) = primary(t) × secondaryFactor
   */
  getSecondaryFreq(tSec: number): number {
    return this.getPrimaryFreq(tSec) * this._secondaryFactor;
  }

  /**
   * Amplitude modulation value (0–1) for the "breathing" effect.
   * Returns a slow sinusoidal LFO that dips from 1.0 down to (1 - amDepth).
   *   am(t) = 1 - amDepth × (sin(2π × amRate × t) mapped to [0, 1])
   */
  getAmValue(tSec: number): number {
    if (this._amDepth <= 0) return 1;
    // Map sine [-1, 1] → [1 - amDepth, 1] so gain never exceeds unity
    const sine = Math.sin(2 * Math.PI * this._amRate * tSec);
    const normalized = (sine + 1) / 2; // [0, 1]
    return 1 - this._amDepth * (1 - normalized);
    // When sine = -1: gain = 1 - amDepth*1   (quietest)
    // When sine = +1: gain = 1 - amDepth*0   (full volume)
  }

  /* ── Debug ── */
  decompose(tSec: number): {
    base: number;
    sweep: number;
    chaos: number;
    primary: number;
    secondary: number;
    am: number;
    factor: number;
    syncNode: string;
  } {
    const sweep =
      this._sweepAmplitude *
      Math.sin((2 * Math.PI * tSec) / this._sweepPeriod);
    const chaos = this._chaosAmount * chaoticWalk(tSec);
    const primary = this.getPrimaryFreq(tSec);
    return {
      base: this._baseFreq,
      sweep: Math.round(sweep * 1000) / 1000,
      chaos: Math.round(chaos * 1000) / 1000,
      primary: Math.round(primary * 100) / 100,
      secondary: Math.round(primary * this._secondaryFactor * 100) / 100,
      am: Math.round(this.getAmValue(tSec) * 1000) / 1000,
      factor: Math.round(this._secondaryFactor * 1000) / 1000,
      syncNode: this._syncNode ?? "none",
    };
  }

  /* ── Static Constants ── */
  static get GOLDEN_RATIO(): number { return GOLDEN_RATIO; }
  static get DEFAULT_SWEEP_AMPLITUDE(): number { return DEFAULT_SWEEP_AMPLITUDE; }
  static get DEFAULT_CHAOS_AMOUNT(): number { return DEFAULT_CHAOS_AMOUNT; }
  static get DEFAULT_SECONDARY_FACTOR(): number { return DEFAULT_SECONDARY_FACTOR; }
  static get DEFAULT_SECONDARY_GAIN(): number { return DEFAULT_SECONDARY_GAIN; }
  static get DEFAULT_AM_DEPTH(): number { return DEFAULT_AM_DEPTH; }
  static get DEFAULT_AM_RATE(): number { return DEFAULT_AM_RATE; }
}
