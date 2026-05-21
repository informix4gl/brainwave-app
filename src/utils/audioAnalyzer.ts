export interface AudioFeatures {
  detectedBpm: number;
  spectralCentroid: number;
  energyLow: number;
  energyMid: number;
  energyHigh: number;
}

export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  bpm?: number;
}

/* ── radix-2 FFT (in-place, complex interleaved) ── */
function fft(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  for (let i = 0, j = 0; i < n; i++) {
    if (j > i) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
    let m = n >> 1;
    while (m >= 1 && j >= m) {
      j -= m;
      m >>= 1;
    }
    j += m;
  }
  for (let len = 2; len <= n; len <<= 1) {
    const half = len >> 1;
    const angle = (-2 * Math.PI) / len;
    for (let i = 0; i < n; i += len) {
      for (let j = 0; j < half; j++) {
        const cos = Math.cos(angle * j);
        const sin = Math.sin(angle * j);
        const tr = re[i + j + half] * cos - im[i + j + half] * sin;
        const ti = re[i + j + half] * sin + im[i + j + half] * cos;
        re[i + j + half] = re[i + j] - tr;
        im[i + j + half] = im[i + j] - ti;
        re[i + j] += tr;
        im[i + j] += ti;
      }
    }
  }
}

function computeSpectrum(frame: Float32Array, fftSize: number): Float64Array {
  const re = new Float64Array(fftSize);
  const im = new Float64Array(fftSize);

  for (let i = 0; i < fftSize; i++) {
    const hann = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (fftSize - 1)));
    re[i] = (frame[i] ?? 0) * hann;
  }

  fft(re, im);

  const halfSize = fftSize / 2;
  const mag = new Float64Array(halfSize);
  for (let i = 0; i < halfSize; i++) {
    mag[i] = Math.sqrt(re[i] * re[i] + im[i] * im[i]);
  }
  return mag;
}

/* ── Mix multi-channel buffer to mono ── */
function mixToMono(buffer: AudioBuffer): Float32Array {
  const length = buffer.length;
  const channels = buffer.numberOfChannels;
  const mono = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let ch = 0; ch < channels; ch++) {
      sum += buffer.getChannelData(ch)[i];
    }
    mono[i] = sum / channels;
  }
  return mono;
}

/* ── BPM detection via energy-envelope autocorrelation ── */
export function detectBPM(channelData: Float32Array, sampleRate: number): number {
  const MIN_BPM = 40;
  const MAX_BPM = 220;

  // Energy envelope with smoothing
  const envelope = new Float32Array(channelData.length);
  const alpha = 0.95; // ~10 Hz LPF at 44.1 kHz
  let prev = 0;
  for (let i = 0; i < channelData.length; i++) {
    const abs = Math.abs(channelData[i]);
    prev = alpha * prev + (1 - alpha) * abs;
    envelope[i] = prev;
  }

  // Downsample to ~200 Hz
  const targetRate = 200;
  const decimationFactor = Math.max(1, Math.floor(sampleRate / targetRate));
  const dsLength = Math.floor(envelope.length / decimationFactor);
  const dsEnvelope = new Float32Array(dsLength);
  const dsRate = sampleRate / decimationFactor;
  for (let i = 0; i < dsLength; i++) {
    dsEnvelope[i] = envelope[i * decimationFactor];
  }

  const minLag = Math.floor((dsRate * 60) / MAX_BPM);
  const maxLag = Math.floor((dsRate * 60) / MIN_BPM);

  let bestLag = minLag;
  let bestCorr = -Infinity;

  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0;
    for (let i = 0; i < dsLength - lag; i++) {
      corr += dsEnvelope[i] * dsEnvelope[i + lag];
    }
    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }

  let bpm = (60 * dsRate) / bestLag;

  // Harmonic rejection: check double-tempo
  const halfLag = Math.floor(bestLag / 2);
  if (halfLag >= minLag) {
    let halfCorr = 0;
    for (let i = 0; i < dsLength - halfLag; i++) {
      halfCorr += dsEnvelope[i] * dsEnvelope[i + halfLag];
    }
    if (halfCorr * 1.1 > bestCorr) {
      bpm = bpm * 2;
    }
  }

  return Math.round(bpm);
}

/* ── Spectral centroid (Hz) via STFT ── */
export function computeSpectralCentroid(
  channelData: Float32Array,
  sampleRate: number,
): number {
  const fftSize = 2048;
  const hopSize = 1024;
  const numFrames =
    Math.floor((channelData.length - fftSize) / hopSize) + 1;

  let totalCentroid = 0;
  let frameCount = 0;

  for (let f = 0; f < numFrames; f++) {
    const start = f * hopSize;
    const frame = channelData.slice(start, start + fftSize);
    const mag = computeSpectrum(frame, fftSize);

    let weightedSum = 0;
    let totalMag = 0;
    for (let k = 0; k < mag.length; k++) {
      const freq = (k * sampleRate) / fftSize;
      weightedSum += freq * mag[k];
      totalMag += mag[k];
    }

    if (totalMag > 1e-6) {
      totalCentroid += weightedSum / totalMag;
      frameCount++;
    }
  }

  return frameCount > 0 ? totalCentroid / frameCount : 0;
}

/* ── Energy distribution across frequency bands ── */
export function computeEnergyDistribution(
  channelData: Float32Array,
  sampleRate: number,
): { low: number; mid: number; high: number } {
  const fftSize = 2048;
  const hopSize = 1024;
  const numFrames =
    Math.floor((channelData.length - fftSize) / hopSize) + 1;

  const LOW_MAX = 250;
  const MID_MAX = 2000;

  let totalLow = 0;
  let totalMid = 0;
  let totalHigh = 0;
  let totalEnergy = 0;

  for (let f = 0; f < numFrames; f++) {
    const start = f * hopSize;
    const frame = channelData.slice(start, start + fftSize);
    const mag = computeSpectrum(frame, fftSize);

    for (let k = 0; k < mag.length; k++) {
      const freq = (k * sampleRate) / fftSize;
      const energy = mag[k] * mag[k];
      totalEnergy += energy;
      if (freq < LOW_MAX) totalLow += energy;
      else if (freq < MID_MAX) totalMid += energy;
      else totalHigh += energy;
    }
  }

  if (totalEnergy < 1e-6) return { low: 0.33, mid: 0.34, high: 0.33 };

  return {
    low: totalLow / totalEnergy,
    mid: totalMid / totalEnergy,
    high: totalHigh / totalEnergy,
  };
}

/* ── Top-level analysis entry point ── */
export function analyzeAudioFeatures(buffer: AudioBuffer): AudioFeatures {
  const mono = mixToMono(buffer);
  const sampleRate = buffer.sampleRate;

  const detectedBpm = detectBPM(mono, sampleRate);
  const spectralCentroid = computeSpectralCentroid(mono, sampleRate);
  const { low, mid, high } = computeEnergyDistribution(mono, sampleRate);

  return {
    detectedBpm,
    spectralCentroid,
    energyLow: low,
    energyMid: mid,
    energyHigh: high,
  };
}
