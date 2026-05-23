# Changelog

## v0.13.0 — Quantum Sync (2025-05-23)

### Advanced Dynamic Synchronization · 量子同化引擎

- **Quantum Sync Modulator**: Sinusoidal micro-sweep (±0.5Hz, ~37s period) + 4-oscillator incommensurate chaotic drift (±0.15Hz) — prevents neural habituation.
- **Golden Ratio Harmonic**: 0.618φ secondary beat frequency for deeper synchronization anchoring.
- **AM Breathing**: Cyber-tidal low-frequency LFO (0.02–0.5Hz) amplitude modulation, mimicking natural brainwave amplitude fluctuations.
- **Sync Target Nodes**: Node-10 Somatic Hibernation (Theta) and Node-12 Core Expansion (Alpha) — one-click preset injection with full parameter lock.
- **Hardened UI**: Split sliders (Secondary Factor, AM Depth, Secondary Gain, Sweep Amplitude), preset-lock UX, auto-exit on brainwave change.
- **Q key shortcut** toggles Quantum Sync.

**Inspiration**: Thanks to Michael Wu for introducing the Monroe Institute's Hemi-Sync technology, which directly inspired the dynamic modulation and sync node designs in this release.

---

## v0.12.0 — Carrier Frequency & Natural Sound Masking

- Adjustable carrier frequency (100–500Hz) for softer, less piercing tones.
- Natural sound masking: ocean, rain, stream, brown/pink/white noise.
- 5-control AudioPlayer layout with per-slider help text.
- Dynamic carrier frequency display in binaural explanation panel.

---

## v0.11.0 — Studio Unification

- Merged `/match` and `/` into `/generate` — single-page studio workflow.
- FileBrowser with keyword + ID3 + spectral analysis → brainwave recommendation.
- Song recommendation cards filtered by selected brainwave state.
- WAV (lossless) + MP3 (192kbps) export.

---

## v0.10.0 — i18n & Theme

- Full zh/en bilingual support with persistent language preference.
- Light/Dark theme toggle.
- Font size slider (10–25px).

---

## v0.9.0 — Foundations

- Tauri v2 + React 18 + TypeScript + Tailwind CSS v4.
- Web Audio API binaural beat engine (Play/Pause/Resume/Stop, triple volume sliders).
- Real-time FFT visualization.
- Local file scanning via Tauri Rust backend.
- Geek/hacker dark theme aesthetic.
