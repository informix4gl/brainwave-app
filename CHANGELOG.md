# Changelog

## [0.1.2] — 2026-05-26

### Fixed
- **Quantum Sync volume overload**: enabling advanced mode previously caused the brainwave layer to jump ~2.6× in perceived loudness — the secondary oscillator pair was summed at `masterGain` with no gain compensation. Added RMS-energy-preserving auto-gain compensation that proportionally reduces primary `binauralGain` when the secondary layer is active, so total binaural output stays consistent with non-advanced levels.
- **"More" button false positives**: `CollapsibleText` now uses `useRef`/`ResizeObserver` to measure actual `scrollHeight` vs `clientHeight` overflow. Short text (≤2 lines) no longer shows a spurious "More/更多" button.

### Changed
- **AboutPage**: all `CollapsibleText` wrappers removed — descriptive text displays fully expanded by default.
- **Master dynamics compressor**: soft-knee `DynamicsCompressorNode` (threshold -12dB, knee 8dB, ratio 4:1, attack 5ms, release 50ms) inserted on the master output chain to catch residual peaks and prevent clipping.
- **Default `secondaryGain`** reduced from `0.5` → `0.2` — the Quantum Sync harmonic layer now acts as subtle texture rather than a volume boost.
- **Gain compensation auto-triggers** on `setCarrierVolume`, `setSecondaryGain`, and `setAmDepth` to keep the mix balanced during real-time slider adjustments.

---

## v0.1.1 — Quantum Sync & Interference Audit (2025-05-23)

### Advanced Dynamic Synchronization · 量子同化引擎

- **Quantum Sync Modulator**: Sinusoidal micro-sweep (±0.5Hz, ~37s period) + 4-oscillator incommensurate chaotic drift (±0.15Hz) — prevents neural habituation.
- **Golden Ratio Harmonic**: 0.618φ secondary beat frequency for deeper synchronization anchoring.
- **AM Breathing**: Cyber-tidal low-frequency LFO (0.02–0.5Hz) amplitude modulation, mimicking natural brainwave amplitude fluctuations.
- **Sync Target Nodes**: Node-10 Somatic Hibernation (Theta) and Node-12 Core Expansion (Alpha) — one-click preset injection with full parameter lock.
- **Hardened UI**: Split sliders (Secondary Factor, AM Depth, Secondary Gain, Sweep Amplitude), preset-lock UX, auto-exit on brainwave change.
- **Q key shortcut** toggles Quantum Sync.

**Inspiration**: Thanks to Michael Wu for introducing the Monroe Institute's Hemi-Sync technology, which directly inspired the dynamic modulation and sync node designs in this release.

### Dual-Layer Anti-Interference Audit · 双重防干扰审计

- **Genre Blacklist**: 22 high-interference genre keywords (Rap, Hiphop, Rock, Metal, Punk, Dubstep, DnB, Hardcore, etc.) with fuzzy word-level matching.
- **BPM Threshold**: Tracks exceeding 120 BPM flagged as high-interference rhythm carriers via energy-envelope autocorrelation.
- **Protected States**: Delta, Theta, Alpha — automatically block interference-heavy tracks with red/amber cyberpunk terminal alert panel.

---

## v0.1.0 — Initial Release (2025-05-22)

- Tauri v2 + React 18 + TypeScript + Tailwind CSS v4.
- Web Audio API binaural beat engine (Play/Pause/Resume/Stop, triple volume sliders).
- Real-time FFT visualization (48-bar canvas, per-state color).
- Adjustable carrier frequency (100–500Hz).
- 6 nature sound masks: ocean, rain, stream, brown/pink/white noise.
- Local file scanning via Tauri Rust backend with ID3 metadata extraction.
- Smart multi-signal analysis: filename keywords + ID3 metadata + spectral features → brainwave recommendation.
- Song recommendation cards filtered by selected brainwave state.
- WAV (lossless) + MP3 (192kbps) export via OfflineAudioContext.
- Full zh/en bilingual support (300+ keys) with persistent language preference.
- Light/Dark theme toggle + font size slider (10–25px).
- Keyboard shortcuts: 1-5 brainwave states, Space play/pause, Esc stop.
- Geek/hacker dark theme aesthetic with scanline overlay and glitch text effects.
