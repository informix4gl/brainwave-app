/* ── Brainwave Audio Engine ── */

import type { BrainwaveState } from "./brainwaveFrequencies";
import { BRAINWAVE_STATES } from "./brainwaveFrequencies";
import { DynamicSyncModulator, type SyncNode } from "../services/DynamicSyncModulator";

declare global {
  interface Window {
    lamejs: {
      Mp3Encoder: new (channels: number, sampleRate: number, kbps: number) => {
        encodeBuffer: (left: Int16Array, right: Int16Array) => Int8Array;
        flush: () => Int8Array;
      };
      WavHeader: unknown;
    };
  }
}

export type NatureSoundType = "brown" | "pink" | "white" | "ocean" | "rain" | "stream";

const FFT_SIZE = 256;
const NOISE_BUFFER_SECS = 4;

export type EngineStatus = "idle" | "playing" | "paused";

class BrainwaveAudioEngine {
  private ctx: AudioContext | null = null;
  private leftOsc: OscillatorNode | null = null;
  private rightOsc: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private userGain: GainNode | null = null;
  private userSource: AudioBufferSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private userBuffer: AudioBuffer | null = null;
  private merger: ChannelMergerNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private _status: EngineStatus = "idle";
  private _binauralFreq = 10;
  private _carrierFreq = 320;
  private _carrierVol = 0.3;
  private _musicVol = 0.7;
  private _noiseVol = 0.15;
  private _natureType: NatureSoundType = "brown";
  // Advanced Quantum Sync
  private _advancedEnabled = false;
  private _secondaryGain = 0.2;
  private _secondaryFactor = 0.618;
  private _sweepAmplitude = 0.5;
  private _amDepth = 0.15;
  private _amRate = 0.08;
  private _syncNode: SyncNode | null = null;
  private _modulator: DynamicSyncModulator | null = null;
  private _leftOsc2: OscillatorNode | null = null;
  private _rightOsc2: OscillatorNode | null = null;
  private _secondaryGainNode: GainNode | null = null;
  private _amGainNode: GainNode | null = null;
  private _merger2: ChannelMergerNode | null = null;
  private _freqUpdateTimer: number | null = null;
  private _startOffset = 0;
  private _startTime = 0;
  private _statusListeners = new Set<(s: EngineStatus) => void>();
  private _audioLoadListeners = new Set<() => void>();

  get status() {
    return this._status;
  }
  get analyserNode() {
    return this.analyser;
  }
  get audioBuffer() {
    return this.userBuffer;
  }

  onStatusChange(cb: (s: EngineStatus) => void) {
    this._statusListeners.add(cb);
    return () => { this._statusListeners.delete(cb); };
  }

  onAudioLoadChange(cb: () => void) {
    this._audioLoadListeners.add(cb);
    return () => { this._audioLoadListeners.delete(cb); };
  }

  private setStatus(s: EngineStatus) {
    this._status = s;
    this._statusListeners.forEach((cb) => cb(s));
  }

  private notifyAudioLoad() {
    this._audioLoadListeners.forEach((cb) => cb());
  }

  /* ── Init ── */
  private ensureCtx() {
    if (!this.ctx || this.ctx.state === "closed") {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /* ── Nature Sound Generator ── */
  private createNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * NOISE_BUFFER_SECS;
    const buffer = ctx.createBuffer(2, length, sampleRate);
    const t = this._natureType;

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);

      if (t === "brown") {
        let acc = 0;
        for (let i = 0; i < length; i++) {
          acc += (Math.random() - 0.5) * 0.02;
          if (acc > 1) acc = 1; else if (acc < -1) acc = -1;
          data[i] = acc * 0.6;
        }
      } else if (t === "pink") {
        // Paul Kellet refined pink noise (6-stage)
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < length; i++) {
          const white = (Math.random() * 2 - 1) * 0.1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.153852;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          const out = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
          data[i] = Math.max(-1, Math.min(1, out * 3));
        }
      } else if (t === "white") {
        for (let i = 0; i < length; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.3;
        }
      } else if (t === "ocean") {
        // Brown noise + slow LFO (~0.12 Hz tidal swell)
        let acc = 0;
        for (let i = 0; i < length; i++) {
          acc += (Math.random() - 0.5) * 0.02;
          if (acc > 1) acc = 1; else if (acc < -1) acc = -1;
          const tSec = i / sampleRate;
          // LFO range 0.4–1.0 — audible tidal ebb and flow
          const lfo = 0.4 + 0.6 * ((Math.sin(2 * Math.PI * 0.12 * tSec) + 1) / 2);
          data[i] = acc * 0.9 * lfo;
        }
      } else if (t === "rain") {
        // High-pass filtered white noise + rapid density modulation
        let prev = 0;
        for (let i = 0; i < length; i++) {
          const raw = (Math.random() * 2 - 1);
          const hp = raw - prev; // simple high-pass (differentiator)
          prev = raw;
          const tSec = i / sampleRate;
          const density = 0.4 + 0.6 * ((Math.sin(2 * Math.PI * 5.7 * tSec + 1.2) + 1) / 2)
            * ((Math.sin(2 * Math.PI * 3.3 * tSec + 0.7) + 1) / 2);
          data[i] = Math.max(-1, Math.min(1, hp * 0.4 * density));
        }
      } else if (t === "stream") {
        // Brown noise with irregular dual-LFO modulation
        let acc = 0;
        for (let i = 0; i < length; i++) {
          acc += (Math.random() - 0.5) * 0.02;
          if (acc > 1) acc = 1; else if (acc < -1) acc = -1;
          const tSec = i / sampleRate;
          // Two unsynchronized sines, mapped to 0.2–1.0 — never silent
          const combined = 0.6 * Math.sin(2 * Math.PI * 0.7 * tSec)
            + 0.4 * Math.sin(2 * Math.PI * 1.3 * tSec + 2.1);
          const mod = 0.2 + 0.8 * ((combined + 1) / 2);
          data[i] = acc * 0.9 * mod;
        }
      }
    }

    this.noiseBuffer = buffer;
    return buffer;
  }

  /* ── Build Graph ── */
  private buildGraph(state: BrainwaveState, customFreq?: number | null) {
    const ctx = this.ensureCtx();
    const binauralFreq =
      customFreq ?? BRAINWAVE_STATES[state].defaultFreq;
    this._binauralFreq = binauralFreq;

    // Create nodes
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 1;

    this.binauralGain = ctx.createGain();
    this.binauralGain.gain.value = this._carrierVol;

    this.userGain = ctx.createGain();
    this.userGain.gain.value = this._musicVol;

    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = this._noiseVol;

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = FFT_SIZE;

    // Channel merger for stereo binaural
    this.merger = ctx.createChannelMerger(2);

    // Left oscillator → merger channel 0
    this.leftOsc = ctx.createOscillator();
    this.leftOsc.type = "sine";
    this.leftOsc.frequency.value = this._carrierFreq;
    this.leftOsc.connect(this.merger, 0, 0);

    // Right oscillator → merger channel 1 (carrier + brainwave delta)
    this.rightOsc = ctx.createOscillator();
    this.rightOsc.type = "sine";
    this.rightOsc.frequency.value = this._carrierFreq + binauralFreq;
    this.rightOsc.connect(this.merger, 0, 1);

    // Secondary oscillators (harmonically-linked) — Quantum Sync only
    if (this._advancedEnabled) {
      this._modulator = new DynamicSyncModulator(binauralFreq);
      this._modulator.setSweepAmplitude(this._sweepAmplitude);
      this._modulator.setSecondaryFactor(this._secondaryFactor);
      this._modulator.setAmDepth(this._amDepth);
      this._modulator.setAmRate(this._amRate);
      if (this._syncNode) {
        this._modulator.applySyncNodePreset(this._syncNode);
      }

      // AM breathing gain node — sits between binauralGain and masterGain
      this._amGainNode = ctx.createGain();
      this._amGainNode.gain.value = 1; // modulated in update loop

      this._secondaryGainNode = ctx.createGain();
      this._secondaryGainNode.gain.value = this._secondaryGain;
      this._merger2 = ctx.createChannelMerger(2);

      this._leftOsc2 = ctx.createOscillator();
      this._leftOsc2.type = "sine";
      this._leftOsc2.frequency.value = this._carrierFreq;
      this._leftOsc2.connect(this._merger2, 0, 0);

      this._rightOsc2 = ctx.createOscillator();
      this._rightOsc2.type = "sine";
      const secondaryBeat = binauralFreq * this._modulator.secondaryFactor;
      this._rightOsc2.frequency.value = this._carrierFreq + secondaryBeat;
      this._rightOsc2.connect(this._merger2, 0, 1);

      this._merger2.connect(this._secondaryGainNode);
      this._secondaryGainNode.connect(this.masterGain!);
    }

    // Nature sound → noiseGain → masterGain (masks the pure tone)
    this.noiseSource = ctx.createBufferSource();
    this.noiseSource.buffer = this.createNoiseBuffer(ctx);
    this.noiseSource.loop = true;
    this.noiseSource.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain);

    // Merger → binauralGain → (amGain) → masterGain
    this.merger.connect(this.binauralGain);
    if (this._advancedEnabled && this._amGainNode) {
      this.binauralGain.connect(this._amGainNode);
      this._amGainNode.connect(this.masterGain);
    } else {
      this.binauralGain.connect(this.masterGain);
    }

    // Soft-knee dynamics compressor — prevents clipping and smooths volume spikes
    this.compressorNode = ctx.createDynamicsCompressor();
    this.compressorNode.threshold.value = -12;
    this.compressorNode.knee.value = 8;
    this.compressorNode.ratio.value = 4;
    this.compressorNode.attack.value = 0.005;
    this.compressorNode.release.value = 0.05;

    // masterGain → compressor → analyser → destination
    this.masterGain.connect(this.compressorNode);
    this.compressorNode.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    // Gain compensation: when advanced mode adds a secondary layer,
    // reduce primary gain so total binaural energy stays consistent.
    this.applyGainCompensation();
  }

  /* ── Gain Compensation ──
   * When advanced mode is active, the secondary oscillator pair adds energy
   * on top of the primary binaural beat. To keep the total perceived loudness
   * stable when toggling advanced mode, we reduce the primary binauralGain
   * proportionally to the secondary layer's contribution. */
  private applyGainCompensation() {
    if (!this.binauralGain || !this.ctx) return;

    if (this._advancedEnabled) {
      // avg AM gain over a full cycle is approximately 1 - amDepth/2
      const avgAmGain = 1 - this._amDepth / 2;
      // Fraction of total binaural energy to keep in primary (dry) layer.
      // As secondaryGain increases, we pull back primaryGain to maintain
      // roughly constant RMS energy in the mixed binaural output.
      const primaryVol = this._carrierVol;
      const secondaryVol = this._secondaryGain;
      const totalTarget = primaryVol; // don't exceed the non-advanced level
      // RMS energy constraint: (compGain * avgAmGain)^2 + secondaryVol^2 <= totalTarget^2
      const energyBudget = Math.max(0, totalTarget * totalTarget - secondaryVol * secondaryVol);
      const compGain = Math.sqrt(energyBudget) / Math.max(avgAmGain, 0.01);
      // Clamp to reasonable range — never push below 25% of original
      const clampedGain = Math.max(primaryVol * 0.25, Math.min(primaryVol, compGain));
      this.binauralGain.gain.value = clampedGain;
    } else {
      this.binauralGain.gain.value = this._carrierVol;
    }
  }

  /* ── User Audio ── */
  private createUserSource() {
    if (!this.ctx || !this.userBuffer || !this.userGain || !this.masterGain)
      return;
    this.userSource = this.ctx.createBufferSource();
    this.userSource.buffer = this.userBuffer;
    this.userSource.connect(this.userGain);
    this.userGain.connect(this.masterGain);
  }

  /* ── Play / Pause / Resume / Stop ── */
  play(state: BrainwaveState, customFreq?: number | null) {
    this.stop();
    this.buildGraph(state, customFreq);

    const ctx = this.ctx!;
    const now = ctx.currentTime;

    this.leftOsc!.start(now);
    this.rightOsc!.start(now);
    if (this._advancedEnabled && this._leftOsc2 && this._rightOsc2) {
      this._leftOsc2.start(now);
      this._rightOsc2.start(now);
    }
    this.noiseSource!.start(now);

    if (this.userBuffer) {
      this.createUserSource();
      this.userSource!.start(now, this._startOffset);
    }

    this._startTime = now;
    this.setStatus("playing");
    this.startFreqUpdateLoop();
  }

  pause() {
    if (this._status !== "playing" || !this.ctx) return;

    this._startOffset += this.ctx.currentTime - this._startTime;

    // Suspend the entire context (preserves graph state)
    this.ctx.suspend();
    this.setStatus("paused");
  }

  resume() {
    if (this._status !== "paused" || !this.ctx) return;
    this.ctx.resume();
    this._startTime = this.ctx.currentTime;
    this.setStatus("playing");
  }

  stop() {
    if (!this.ctx) return;

    this.stopFreqUpdateLoop();

    try {
      this.leftOsc?.stop();
      this.rightOsc?.stop();
      this._leftOsc2?.stop();
      this._rightOsc2?.stop();
      this.userSource?.stop();
      this.noiseSource?.stop();
    } catch {
      // Already stopped
    }

    this.leftOsc?.disconnect();
    this.rightOsc?.disconnect();
    this._leftOsc2?.disconnect();
    this._rightOsc2?.disconnect();
    this.userSource?.disconnect();
    this.noiseSource?.disconnect();
    this.merger?.disconnect();
    this._merger2?.disconnect();
    this.binauralGain?.disconnect();
    this._secondaryGainNode?.disconnect();
    this._amGainNode?.disconnect();
    this.userGain?.disconnect();
    this.noiseGain?.disconnect();
    this.masterGain?.disconnect();
    this.compressorNode?.disconnect();
    this.analyser?.disconnect();

    this.leftOsc = null;
    this.rightOsc = null;
    this._leftOsc2 = null;
    this._rightOsc2 = null;
    this.userSource = null;
    this.noiseSource = null;
    this.merger = null;
    this._merger2 = null;
    this.binauralGain = null;
    this._secondaryGainNode = null;
    this._amGainNode = null;
    this.userGain = null;
    this.noiseGain = null;
    this.masterGain = null;
    this.compressorNode = null;
    this.analyser = null;
    this._modulator = null;

    this._startOffset = 0;
    this.setStatus("idle");

    // Suspend context to guarantee complete silence
    this.ctx.suspend();
  }

  /* ── Carrier Frequency ── */
  setCarrierFrequency(freq: number) {
    this._carrierFreq = Math.max(100, Math.min(500, freq));
    if (this.leftOsc && this.ctx) {
      const now = this.ctx.currentTime;
      this.leftOsc.frequency.setTargetAtTime(this._carrierFreq, now, 0.05);
      this.rightOsc!.frequency.setTargetAtTime(
        this._carrierFreq + this._binauralFreq,
        now,
        0.05,
      );
    }
  }

  /* ── Nature Sound Type ── */
  setNatureSoundType(type: NatureSoundType) {
    if (this._natureType === type) return;
    this._natureType = type;
    this.noiseBuffer = null; // invalidate cache

    if (this._status !== "idle" && this.ctx && this.noiseSource && this.noiseGain) {
      const ctx = this.ctx;
      const newBuffer = this.createNoiseBuffer(ctx);
      const newSource = ctx.createBufferSource();
      newSource.buffer = newBuffer;
      newSource.loop = true;
      newSource.connect(this.noiseGain);
      const now = ctx.currentTime;
      try { this.noiseSource.stop(now); } catch { /* already stopped */ }
      this.noiseSource.disconnect();
      newSource.start(now);
      this.noiseSource = newSource;
    }
  }

  /* ── Volume ── */
  setCarrierVolume(v: number) {
    this._carrierVol = Math.max(0, Math.min(1, v));
    if (this.binauralGain && this.ctx) {
      this.applyGainCompensation();
    }
  }

  setMusicVolume(v: number) {
    this._musicVol = Math.max(0, Math.min(1, v));
    if (this.userGain) {
      this.userGain.gain.setTargetAtTime(
        this._musicVol,
        this.ctx!.currentTime,
        0.05,
      );
    }
  }

  setNoiseVolume(v: number) {
    this._noiseVol = Math.max(0, Math.min(1, v));
    if (this.noiseGain) {
      this.noiseGain.gain.setTargetAtTime(
        this._noiseVol,
        this.ctx!.currentTime,
        0.05,
      );
    }
  }

  get carrierVolume() {
    return this._carrierVol;
  }
  get musicVolume() {
    return this._musicVol;
  }
  get noiseVolume() {
    return this._noiseVol;
  }
  get binauralFrequency() {
    return this._binauralFreq;
  }
  get carrierFrequency() {
    return this._carrierFreq;
  }
  get natureSoundType() {
    return this._natureType;
  }

  /* ── User Audio File ── */
  async loadUserAudio(file: File): Promise<void> {
    const ctx = this.ensureCtx();
    const arrayBuf = await file.arrayBuffer();
    this.userBuffer = await ctx.decodeAudioData(arrayBuf);
    this.notifyAudioLoad();
  }

  hasUserAudio(): boolean {
    return this.userBuffer !== null;
  }

  /* ── Export ── */
  async exportAudio(
    state: BrainwaveState,
    customFreq?: number | null,
    format: "wav" | "mp3" = "wav",
    onProgress?: (msg: string) => void,
  ): Promise<Blob> {
    const duration = this.userBuffer?.duration ?? 30;
    const sampleRate = 44100;
    const offlineCtx = new OfflineAudioContext(2, sampleRate * duration, sampleRate);

    const binauralFreq =
      customFreq ?? BRAINWAVE_STATES[state].defaultFreq;

    // Build offline graph
    const leftOsc = offlineCtx.createOscillator();
    leftOsc.type = "sine";
    leftOsc.frequency.value = this._carrierFreq;

    const rightOsc = offlineCtx.createOscillator();
    rightOsc.type = "sine";
    rightOsc.frequency.value = this._carrierFreq + binauralFreq;

    const merger = offlineCtx.createChannelMerger(2);
    leftOsc.connect(merger, 0, 0);
    rightOsc.connect(merger, 0, 1);

    const binauralGain = offlineCtx.createGain();
    binauralGain.gain.value = this._carrierVol;
    merger.connect(binauralGain);

    const masterGain = offlineCtx.createGain();
    masterGain.gain.value = 1;

    // Secondary oscillators for export (frequency snapshot)
    if (this._advancedEnabled) {
      const tSnapshot = performance.now() / 1000;
      const tmpMod = new DynamicSyncModulator(binauralFreq);
      tmpMod.setSweepAmplitude(this._sweepAmplitude);
      tmpMod.setSecondaryFactor(this._secondaryFactor);
      tmpMod.setAmDepth(this._amDepth);
      tmpMod.setAmRate(this._amRate);
      if (this._syncNode) tmpMod.applySyncNodePreset(this._syncNode);
      const secondaryFreq = tmpMod.getSecondaryFreq(tSnapshot);
      const amSnapshot = tmpMod.getAmValue(tSnapshot);

      // Gain compensation for export — same RMS-energy-preserving formula as live graph
      const avgAmGain = 1 - this._amDepth / 2;
      const energyBudget = Math.max(0, this._carrierVol * this._carrierVol - this._secondaryGain * this._secondaryGain);
      const compGain = Math.sqrt(energyBudget) / Math.max(avgAmGain, 0.01);
      const clampedGain = Math.max(this._carrierVol * 0.25, Math.min(this._carrierVol, compGain));
      binauralGain.gain.value = clampedGain;

      const leftOsc2 = offlineCtx.createOscillator();
      leftOsc2.type = "sine";
      leftOsc2.frequency.value = this._carrierFreq;

      const rightOsc2 = offlineCtx.createOscillator();
      rightOsc2.type = "sine";
      rightOsc2.frequency.value = this._carrierFreq + secondaryFreq;

      const merger2 = offlineCtx.createChannelMerger(2);
      leftOsc2.connect(merger2, 0, 0);
      rightOsc2.connect(merger2, 0, 1);

      const secondaryGain = offlineCtx.createGain();
      secondaryGain.gain.value = this._secondaryGain;
      merger2.connect(secondaryGain);
      secondaryGain.connect(masterGain);

      // AM gain node for breathing snapshot in export
      const amGainExport = offlineCtx.createGain();
      amGainExport.gain.value = amSnapshot;
      binauralGain.disconnect();
      binauralGain.connect(amGainExport);
      amGainExport.connect(masterGain);

      leftOsc2.start(0);
      rightOsc2.start(0);
      leftOsc2.stop(duration);
      rightOsc2.stop(duration);
    } else {
      binauralGain.connect(masterGain);
    }

    // Nature sound layer — generated directly with offline sample rate to avoid cache mismatch
    const noiseBuf = offlineCtx.createBuffer(2, sampleRate * NOISE_BUFFER_SECS, sampleRate);
    const nt = this._natureType;
    for (let ch = 0; ch < 2; ch++) {
      const data = noiseBuf.getChannelData(ch);
      if (nt === "brown") {
        let acc = 0;
        for (let i = 0; i < data.length; i++) {
          acc += (Math.random() - 0.5) * 0.02;
          if (acc > 1) acc = 1; else if (acc < -1) acc = -1;
          data[i] = acc * 0.6;
        }
      } else if (nt === "pink") {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < data.length; i++) {
          const white = (Math.random() * 2 - 1) * 0.1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.153852;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          const out = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
          data[i] = Math.max(-1, Math.min(1, out * 3));
        }
      } else if (nt === "white") {
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.3;
        }
      } else if (nt === "ocean") {
        let acc = 0;
        for (let i = 0; i < data.length; i++) {
          acc += (Math.random() - 0.5) * 0.02;
          if (acc > 1) acc = 1; else if (acc < -1) acc = -1;
          const tSec = i / sampleRate;
          const lfo = 0.4 + 0.6 * ((Math.sin(2 * Math.PI * 0.12 * tSec) + 1) / 2);
          data[i] = acc * 0.9 * lfo;
        }
      } else if (nt === "rain") {
        let prev = 0;
        for (let i = 0; i < data.length; i++) {
          const raw = (Math.random() * 2 - 1);
          const hp = raw - prev;
          prev = raw;
          const tSec = i / sampleRate;
          const density = 0.4 + 0.6 * ((Math.sin(2 * Math.PI * 5.7 * tSec + 1.2) + 1) / 2)
            * ((Math.sin(2 * Math.PI * 3.3 * tSec + 0.7) + 1) / 2);
          data[i] = Math.max(-1, Math.min(1, hp * 0.4 * density));
        }
      } else if (nt === "stream") {
        let acc = 0;
        for (let i = 0; i < data.length; i++) {
          acc += (Math.random() - 0.5) * 0.02;
          if (acc > 1) acc = 1; else if (acc < -1) acc = -1;
          const tSec = i / sampleRate;
          const combined = 0.6 * Math.sin(2 * Math.PI * 0.7 * tSec)
            + 0.4 * Math.sin(2 * Math.PI * 1.3 * tSec + 2.1);
          const mod = 0.2 + 0.8 * ((combined + 1) / 2);
          data[i] = acc * 0.9 * mod;
        }
      }
    }
    const noiseSrc = offlineCtx.createBufferSource();
    noiseSrc.buffer = noiseBuf;
    noiseSrc.loop = true;
    const noiseGain = offlineCtx.createGain();
    noiseGain.gain.value = this._noiseVol;
    noiseSrc.connect(noiseGain);
    noiseGain.connect(masterGain);

    const compressor = offlineCtx.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.knee.value = 8;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.005;
    compressor.release.value = 0.05;
    masterGain.connect(compressor);
    compressor.connect(offlineCtx.destination);

    // User audio
    if (this.userBuffer) {
      const userSrc = offlineCtx.createBufferSource();
      userSrc.buffer = this.userBuffer;
      const userGain = offlineCtx.createGain();
      userGain.gain.value = this._musicVol;
      userSrc.connect(userGain);
      userGain.connect(masterGain);
      userSrc.start(0);
    }

    leftOsc.start(0);
    rightOsc.start(0);
    noiseSrc.start(0);
    leftOsc.stop(duration);
    rightOsc.stop(duration);
    noiseSrc.stop(duration);

    onProgress?.("rendering");
    const rendered = await offlineCtx.startRendering();

    if (format === "mp3") return await this.audioBufferToMp3Blob(rendered, onProgress);
    return this.audioBufferToWavBlob(rendered);
  }

  /* ── WAV Encoding ── */
  private audioBufferToWavBlob(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length;
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const dataSize = length * blockAlign;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;

    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);

    // RIFF header
    this.writeString(view, 0, "RIFF");
    view.setUint32(4, totalSize - 8, true);
    this.writeString(view, 8, "WAVE");

    // fmt chunk
    this.writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true);

    // data chunk
    this.writeString(view, 36, "data");
    view.setUint32(40, dataSize, true);

    // Samples
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
        const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, int16, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  }

  private writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  /* ── MP3 Encoding ── */
  private async audioBufferToMp3Blob(
    buffer: AudioBuffer,
    onProgress?: (msg: string) => void,
  ): Promise<Blob> {
    onProgress?.("encoding: init");

    const sampleRate = buffer.sampleRate;
    const left = buffer.getChannelData(0);
    const right = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : left;

    const Encoder = window.lamejs?.Mp3Encoder;
    if (!Encoder || typeof Encoder !== "function") {
      throw new Error("MP3 encoder not available (window.lamejs not loaded)");
    }

    const encoder = new Encoder(2, sampleRate, 192);
    const sampleBlockSize = 1152;
    const mp3Chunks: Uint8Array[] = [];
    const totalBlocks = Math.ceil(left.length / sampleBlockSize);

    for (let i = 0; i < left.length; i += sampleBlockSize) {
      const blockIdx = Math.floor(i / sampleBlockSize);
      if (blockIdx > 0 && blockIdx % 20 === 0) {
        onProgress?.(`encoding: ${Math.round((blockIdx / totalBlocks) * 100)}%`);
        // Yield to the event loop so React can render progress updates
        await new Promise((r) => setTimeout(r, 0));
      }

      const leftChunk = new Int16Array(sampleBlockSize);
      const rightChunk = new Int16Array(sampleBlockSize);
      for (let j = 0; j < sampleBlockSize && i + j < left.length; j++) {
        const sampleIdx = i + j;
        leftChunk[j] = Math.max(-32768, Math.min(32767, Math.round(left[sampleIdx] * 32767)));
        rightChunk[j] = Math.max(-32768, Math.min(32767, Math.round(right[sampleIdx] * 32767)));
      }
      const mp3Data = encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3Data.length > 0) {
        const chunk = new Uint8Array(mp3Data.length);
        chunk.set(mp3Data);
        mp3Chunks.push(chunk);
      }
    }

    const finalData = encoder.flush();
    if (finalData.length > 0) {
      const chunk = new Uint8Array(finalData.length);
      chunk.set(finalData);
      mp3Chunks.push(chunk);
    }

    if (mp3Chunks.length === 0) {
      throw new Error("MP3 encoder produced no output");
    }

    onProgress?.("assembling");
    const totalLength = mp3Chunks.reduce((sum, c) => sum + c.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of mp3Chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return new Blob([result.buffer], { type: "audio/mpeg" });
  }

  /* ── Frequency Update Loop (Quantum Sync) ── */
  private startFreqUpdateLoop() {
    if (!this._advancedEnabled || !this._modulator) return;
    this.stopFreqUpdateLoop();

    const update = () => {
      if (!this.ctx || !this._modulator || !this._advancedEnabled || this._status !== "playing") {
        this._freqUpdateTimer = null;
        return;
      }
      const tSec = performance.now() / 1000;
      const primaryBeat = this._modulator.getPrimaryFreq(tSec);
      const secondaryBeat = this._modulator.getSecondaryFreq(tSec);
      const now = this.ctx.currentTime;

      if (this.rightOsc) {
        this.rightOsc.frequency.setTargetAtTime(
          this._carrierFreq + primaryBeat, now, 0.08,
        );
      }
      if (this._rightOsc2) {
        this._rightOsc2.frequency.setTargetAtTime(
          this._carrierFreq + secondaryBeat, now, 0.08,
        );
      }

      // AM breathing — gentle gain modulation for tidal pulse
      if (this._amGainNode) {
        const amVal = this._modulator.getAmValue(tSec);
        this._amGainNode.gain.setTargetAtTime(amVal, now, 0.15);
      }

      this._freqUpdateTimer = window.setTimeout(update, 150);
    };
    update();
  }

  private stopFreqUpdateLoop() {
    if (this._freqUpdateTimer !== null) {
      clearTimeout(this._freqUpdateTimer);
      this._freqUpdateTimer = null;
    }
  }

  /* ── Advanced Sync Control ── */
  setAdvancedSyncEnabled(enabled: boolean) {
    if (this._advancedEnabled === enabled) return;
    this._advancedEnabled = enabled;
    // Requires a full graph rebuild — stop current playback
    const wasPlaying = this._status === "playing";
    if (wasPlaying) {
      this._startOffset += (this.ctx?.currentTime ?? 0) - this._startTime;
    }
    this.stop();
    // Caller must restart playback for changes to take effect
  }

  setSweepAmplitude(amplitude: number) {
    this._sweepAmplitude = Math.max(0, Math.min(2, amplitude));
    if (this._modulator) {
      this._modulator.setSweepAmplitude(this._sweepAmplitude);
    }
  }

  setSecondaryGain(gain: number) {
    this._secondaryGain = Math.max(0, Math.min(1, gain));
    if (this._secondaryGainNode && this.ctx) {
      this._secondaryGainNode.gain.setTargetAtTime(
        this._secondaryGain, this.ctx.currentTime, 0.05,
      );
    }
    this.applyGainCompensation();
  }

  setSecondaryFactor(factor: number) {
    this._secondaryFactor = Math.max(0.1, Math.min(1.5, factor));
    if (this._modulator) {
      this._modulator.setSecondaryFactor(this._secondaryFactor);
    }
  }

  setAmDepth(depth: number) {
    this._amDepth = Math.max(0, Math.min(0.5, depth));
    if (this._modulator) {
      this._modulator.setAmDepth(this._amDepth);
    }
    this.applyGainCompensation();
  }

  setAmRate(rate: number) {
    this._amRate = Math.max(0.02, Math.min(0.5, rate));
    if (this._modulator) {
      this._modulator.setAmRate(this._amRate);
    }
  }

  setSyncNode(node: SyncNode | null) {
    this._syncNode = node;
    if (node) {
      // Always compute preset values into instance state so UI reflects them,
      // regardless of whether audio is currently playing.
      const tmp = new DynamicSyncModulator(this._binauralFreq);
      tmp.applySyncNodePreset(node);
      this._secondaryFactor = tmp.secondaryFactor;
      this._amDepth = tmp.amDepth;
      this._amRate = tmp.amRate;
      this._sweepAmplitude = tmp.sweepAmplitude;
    }
    // Also apply to the live modulator if audio is running
    if (this._modulator) {
      this._modulator.applySyncNodePreset(node);
    }
  }

  get advancedEnabled(): boolean { return this._advancedEnabled; }
  get sweepAmplitude(): number { return this._sweepAmplitude; }
  get secondaryGain(): number { return this._secondaryGain; }
  get secondaryFactor(): number { return this._secondaryFactor; }
  get amDepth(): number { return this._amDepth; }
  get amRate(): number { return this._amRate; }
  get syncNode(): SyncNode | null { return this._syncNode; }

  /* ── Cleanup ── */
  destroy() {
    this.stopFreqUpdateLoop();
    this.stop();
    this.ctx?.close();
    this.ctx = null;
    this.userBuffer = null;
  }
}

export const audioEngine = new BrainwaveAudioEngine();
