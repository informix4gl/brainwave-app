# BrainSync — Development Roadmap

> 脑波同化音乐桌面应用 · Brainwave Entrainment Music Desktop App
> Tauri + React + Tailwind CSS · Geek/Hacker Aesthetic

---

## ✅ Phase 0: Project Skeleton

- [x] Scaffold Vite + React + TypeScript project
- [x] Install & configure Tailwind CSS v4
- [x] Initialize Tauri (Rust backend)
- [x] Configure `tauri-plugin-fs` for local file reading
- [x] Set window size 1200×800, min 900×600
- [x] Define dark geek-theme CSS variables (--background, --accent, --terminal, etc.)
- [x] Add monospace font stack (JetBrains Mono / Fira Code / Cascadia Code)
- [x] Custom scrollbar styling (green-on-dark)
- [x] Run `npm run tauri dev` — desktop window appears

---

## ✅ Phase 1: Geek UI Foundation

- [x] Terminal-style banner component with ASCII art
- [x] Scanline overlay effect (CSS animation)
- [x] Cursor blink animation utility class
- [x] Glitch text animation utility class
- [x] Geek-styled button component (monospace, green border, hover glow)
- [x] Geek-styled input / select / slider components
- [x] Geek-styled card component (terminal window look)
- [x] Layout shell: header nav + main content area + footer
- [x] Navigation component with active-route highlighting (green underline)
- [x] Responsive grid system (1-col mobile, 2-col desktop)

---

## ✅ Phase 2: i18n — 中英切换

- [x] Language context/provider (React Context)
- [x] Translation dictionary (zh / en) for all UI strings
- [x] Language toggle button in header (中/EN)
- [x] Translate all static page content (nav, footer, about)
- [x] Translate brainwave state names & descriptions
- [x] Translate music genre / mood / tempo labels
- [x] Translate error messages & notifications
- [x] Persist language preference (localStorage)
- [x] Light/Dark theme toggle

---

## ✅ Phase 3: Brainwave Core Logic

- [x] `BrainwaveState` type (delta | theta | alpha | beta | gamma)
- [x] `BRAINWAVE_STATES` config: id, name/nameZh, freq range, defaultFreq, color, symbol, description/descriptionZh, benefits
- [x] Mood / Tempo / Genre → brainwave mappings
- [x] Frequency range utility: `getFrequencyRange` + `clampFrequency` + `getDefaultFrequency`
- [x] BrainSync React Context: selectedState, customFreq, audio state
- [x] Bilingual labels for all moods, tempos, genres (en/zh)

---

## ✅ Phase 4: Audio Engine (Web Audio API)

- [x] `BrainwaveAudioEngine` singleton class
- [x] AudioContext lifecycle (create, resume, suspend, close)
- [x] Binaural beat oscillators: left = baseFreq, right = baseFreq + binauralFreq
- [x] Audio node graph: oscillators → merger → binauralGain → masterGain → destination
- [x] User audio loading: File.arrayBuffer → decodeAudioData → BufferSource
- [x] Triple volume sliders: binaural beat + noise mask + music volume
- [x] AnalyserNode for real-time FFT (256-point)
- [x] `requestAnimationFrame` visualization loop (canvas bar chart)
- [x] Play / Pause / Resume / Stop methods
- [x] `useAudioEngine` React hook: status, error, full controls, export
- [x] WAV export via OfflineAudioContext
- [x] MP3 export (192kbps via lamejs)

---

## ✅ Phase 5: Local File Scanning (Tauri)

- [x] Rust command: `scan_audio_files` — recursive directory scan (mp3, wav, flac, ogg, aac, m4a, wma, opus)
- [x] Rust command: `read_audio_file_bytes` — read file as Uint8Array
- [x] Rust command: `read_audio_metadata` — ID3 metadata extraction
- [x] File browser UI (scrollable geek-styled table)
- [x] Smart keyword matching: filename analysis → brainwave auto-recommendation
- [x] Drag-and-drop file support (Tauri `.path` API + drop zone)
- [x] Recently-opened files list (localStorage, max 8)
- [x] "recent" label i18n + clear button

---

## ✅ Phase 6: Studio Page Unification

- [x] `/match` removed — Mood/Tempo/Genre selectors dropped (analysis is automatic)
- [x] Home page removed — direct landing on `/` = studio
- [x] `/generate` = main working page: FileBrowser + Brainwave selector + Binaural + AudioPlayer
- [x] Song recommendation cards filtered by selected brainwave state
- [x] "No recommendations" fallback UI

---

## ✅ Phase 7: Audio Player & Visualization

- [x] Canvas-based real-time FFT frequency bar visualization (per-state color)
- [x] Status indicator: idle (grey dot) / playing (color pulsing dot) / paused (yellow dot)
- [x] Error message display (red terminal-style alert)
- [x] Play / Pause / Stop button group (geek-styled)
- [x] Export WAV / MP3 with progress indicator + auto-open folder option
- [x] Keyboard shortcuts: Space=play/pause, Esc=stop, 1-5=brainwave states, Q=Quantum Sync toggle

---

## ✅ Phase 8: Routing & Navigation

- [x] `/` — Studio page
- [x] `/about` — About page (features, how it works, tech stack, disclaimer)
- [x] Route group layout: AppHeader + main content + footer
- [x] Loading skeletons (Suspense fallback)
- [x] Error boundary (root-level, geek-styled fatal error)
- [x] 404 Not Found page (geek-styled)

---

## ✅ Phase 9: Polish & QA

- [x] Full i18n coverage — zero hardcoded strings
- [x] Font size slider in header (10–25px, persisted)
- [x] Developer credit: "Teng Zuo" in footer
- [x] Footer version: BrainSync v0.1.2
- [x] Keyboard shortcuts legend in info banner
- [x] Error handling for all Tauri commands (retry button)
- [x] Consistent geek aesthetic (CSS variables, no hardcoded colors)
- [x] Performance: FFT animFrame only runs when playing, canvas cleared on stop
- [x] Explanatory text font size +50% (`text-[10px]`→`text-[15px]`, `text-xs`→`text-[18px]`)

---

## ✅ Phase 10: Carrier Frequency Control & Natural Sound Masking

- [x] Replace hardcoded `CARRIER_FREQ` with instance state `_carrierFreq` (100–500Hz)
- [x] `NatureSoundType`: brown / pink / white / ocean / rain / stream
- [x] 6-way branching noise generator (brown random-walk, pink Paul Kellet, white random, ocean tidal LFO, rain high-pass, stream bandpass)
- [x] `setCarrierFrequency` real-time `setTargetAtTime` oscillator update
- [x] `setNatureSoundType` cache invalidation + live buffer swap (no glitch)
- [x] `setBinauralVolume` → `setCarrierVolume` (public API rename)
- [x] `exportAudio` includes dynamic carrier + nature sound layer
- [x] 5-control AudioPlayer layout (carrier freq, carrier vol, type selector, nature vol, music vol)
- [x] Headphone reminder + carrier min volume tip in AudioPlayer
- [x] Dynamic carrier frequency display in GeneratePage binaural explanation
- [x] 16 new i18n keys + updated `about.howDesc3`

---

## ✅ Phase 11: Advanced Dynamic Synchronization (Quantum Sync) · 量子同化引擎

- [x] `src/services/DynamicSyncModulator.ts` — core algorithm
- [x] Sinusoidal micro-sweep: ±0.5Hz, ~37s period
- [x] Chaotic drift: 4 incommensurate sine oscillators, bounded ±0.15Hz
- [x] Golden ratio harmonic: 0.618φ secondary beat frequency
- [x] Secondary oscillator pair + gain node + channel merger in audio graph
- [x] AM breathing: low-frequency LFO (0.02–0.5Hz) on carrier amplitude
- [x] AM gain node inserted between binauralGain and masterGain
- [x] Real-time frequency update loop (150ms `setTimeout`, `setTargetAtTime` smoothing)
- [x] Export pipeline: secondary layer + AM snapshot included in offline render
- [x] **Sync Target Nodes**: Node-10 Somatic Hibernation (Theta) + Node-12 Core Expansion (Alpha)
- [x] `SYNC_NODE_PRESETS` lookup table with brainwave, amRate, amDepth, factor, sweep presets
- [x] **Hardened UI**: 4 split sliders (Secondary Factor, Secondary Gain, AM Depth, Sweep Amplitude)
- [x] Neon-glow `[进阶模式: 量子同化]` toggle with per-state color
- [x] Sync node pill-button selector (Manual / Node-10 / Node-12)
- [x] **Preset-lock UX**: sliders disabled + greyed when preset active; Secondary Gain always adjustable
- [x] **Deep-linkage fix**: `setSyncNode` always writes preset values to instance state (even with null modulator)
- [x] Node-10 click → auto-switches brainwave to Theta + injects params + restarts audio if playing
- [x] Node-12 click → auto-switches brainwave to Alpha + injects params + restarts audio if playing
- [x] Auto-exit `useEffect`: switching brainwave away from preset target auto-clears syncNode
- [x] Full i18n (zh/en) for all Quantum Sync labels, hints, and help texts
- [x] Q key shortcut toggles Quantum Sync
- [x] GeneratePage banner + AboutPage updated with Quantum Sync descriptions
- [x] **Special Thanks**: Michael Wu 分享了门罗研究所 (The Monroe Institute) Hemi-Sync 技术理念，启发了量子同化引擎的设计方向

---

## ✅ Phase 12: Genre Metadata + BPM Anti-Interference Audit · 流派元数据 + BPM 防干扰双重审计

- [x] `src/utils/interferenceDetector.ts` — dual-layer audit engine
- [x] Genre blacklist (22 keywords): Rap, Hiphop, Rock, Metal, Punk, Dubstep, DnB, Hardcore, Hardstyle, Trap, Drill, etc.
- [x] BPM threshold: > 120 = high-interference rhythm track
- [x] Protected states: Delta, Theta, Alpha — blocked from receiving interference-heavy tracks
- [x] Auto-fallback: when recommended brainwave is blocked, reroute to highest non-blocked state
- [x] `ScoredFile.interference` field — detection result through full analysis pipeline
- [x] Integrated into all 4 file-load paths: browse file, table click, drag-drop, recent files
- [x] `!` interference warning badge in file browser table (red=danger, amber=warning)
- [x] `BrainSyncContext.interference` — shared state for cross-component warning propagation
- [x] Cyberpunk terminal alert panel in AudioPlayer: red/amber, genre hits + BPM value + recommendation
- [x] Full i18n (zh/en) for all warning labels, descriptions, and recommendations

---

## ✅ Phase 13: UI Compact Mode & Collapsible Help Texts · 折叠式说明文本

- [x] `CollapsibleText` component: 2-line clamp + 更多/More toggle + 收起/Less expand
- [x] Applied to all AudioPlayer help texts (carrier freq/vol, nature type/vol, music vol, Quantum Sync 4 sliders)
- [x] Applied to AboutPage descriptions (tagline, whatDesc, howDesc ×5, thanksDesc, disclaimer)
- [x] Applied to SongRecommendations track descriptions
- [x] Explicitly excluded: workflow banner, brainwave details, binaural explanation, interference warning, headphone/carrier warnings
- [x] Unused imports cleaned up

---

## ✅ Phase 14: Git & Changelog

- [x] `.gitignore` (node_modules, target, .env, dist, etc.)
- [x] Initialize local Git repository
- [x] Configure identity: Teng Zuo <zuoteng@gmail.com>
- [x] Initial commit: 75 files, 14,829 lines
- [x] `CHANGELOG.md` — v0.9.0 through v0.13.0 with full release notes
- [x] `.github/workflows/release.yml` — automated CI/CD for v* tags (Windows/macOS/Ubuntu)
- [x] `.github/workflows/release.yml` — Windows portable .exe extraction + upload (softprops/action-gh-release)
- [x] `README.md` — full v0.1.1 rewrite: Quantum Sync, interference audit, credits, bilingual
- [x] `tauri.conf.json` version bump 0.1.0 → 0.1.2

---

## ✅ Phase 15: v0.1.2 — Audio Mix Normalization & UI Polish

- [x] **Quantum Sync auto-gain compensation**: RMS-energy-preserving formula reduces primary `binauralGain` proportionally when secondary harmonic layer is active, keeping total binaural output consistent with non-advanced mode
- [x] **Master DynamicsCompressorNode**: soft-knee 4:1 compressor (-12dB threshold, 8dB knee) on master output chain to catch residual peaks and prevent clipping
- [x] **Default `secondaryGain` lowered**: `0.5` → `0.2` — harmonic layer now acts as subtle texture, not volume boost
- [x] **Gain compensation auto-triggers**: `setCarrierVolume`, `setSecondaryGain`, `setAmDepth` all call `applyGainCompensation()` to maintain mix balance during real-time adjustments
- [x] **Export pipeline parity**: same compressor + gain compensation applied in `OfflineAudioContext` rendering
- [x] **`CollapsibleText` overflow detection**: `useRef` + `ResizeObserver` measures actual `scrollHeight` vs `clientHeight` — "More/更多" button only appears when text genuinely overflows 2 lines
- [x] **AboutPage full expansion**: all `CollapsibleText` wrappers removed — descriptive text always displayed in full
- [x] All version strings bumped to `0.1.2` (`package.json`, `package-lock.json`, `tauri.conf.json`, `Cargo.toml`, `README.md`)
- [x] `CHANGELOG.md` updated with `[0.1.2]` entry in Keep a Changelog format

---

## Quick Start

```bash
cd C:\Projects\brainwave-app
npm run tauri dev
```

---

> `[ ]` = pending · `[~]` = in progress · `[x]` = done
