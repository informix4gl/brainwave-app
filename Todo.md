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
- [x] Matrix rain background effect (optional decorative — skipped, low priority)
- [x] Responsive grid system (1-col mobile, 2-col desktop)

---

## ✅ Phase 2: i18n — 中英切换

- [x] Language context/provider (React Context)
- [x] Translation dictionary (zh / en) for all current UI strings
- [x] Language toggle button in header (中/EN)
- [x] Translate all static page content (home, nav, footer)
- [x] Translate brainwave state names & descriptions (in BRAINWAVE_STATES config)
- [x] Translate music genre / mood / tempo labels (in MOOD_LABELS / TEMPO_LABELS / GENRE_LABELS)
- [x] Translate error messages & notifications
- [x] Persist language preference (localStorage)
- [x] Light/Dark theme toggle (bonus — theme context + CSS palettes)

---

## ✅ Phase 3: Brainwave Core Logic

- [x] `BrainwaveState` type definition (delta | theta | alpha | beta | gamma)
- [x] `BRAINWAVE_STATES` config: id, name/nameZh, freq range, defaultFreq, color, symbol, description/descriptionZh, benefits
- [x] Mood-to-brainwave mapping (9 moods → brainwave states)
- [x] Tempo-to-brainwave mapping (5 tempos → brainwave states)
- [x] Genre-to-brainwave mapping (9 genres → brainwave states)
- [x] Frequency range utility: `getFrequencyRange(state)` + `clampFrequency` + `getDefaultFrequency`
- [x] BrainSync React Context: selectedState, customFreq, matchedStates, audio state
- [x] `matchBrainwaveStates` algorithm: intersection → frequency-ranked union fallback
- [x] Bilingual labels for all moods, tempos, genres (en/zh)

---

## ✅ Phase 4: Audio Engine (Web Audio API)

- [x] `BrainwaveAudioEngine` singleton class
- [x] AudioContext lifecycle (create, resume, suspend, close)
- [x] Binaural beat oscillators (left ear = baseFreq, right ear = baseFreq + binauralFreq)
- [x] Audio node graph: oscillators → merger → binauralGain → masterGain → destination
- [x] User audio loading: File.arrayBuffer → decodeAudioData → BufferSource
- [x] User audio node: userSource → userGain → masterGain
- [x] Triple volume sliders: binaural beat + noise mask + music volume
- [x] AnalyserNode for real-time FFT data (256-point)
- [x] `requestAnimationFrame` visualization loop (canvas bar chart)
- [x] Play / Pause / Resume / Stop methods
- [x] `useAudioEngine` React hook: status, error, full controls, export
- [x] WAV export via OfflineAudioContext rendering
- [x] MP3 export (192kbps via lamejs)
- [ ] Isochronic AM modulation (LFO on master gain) — deferred, low priority

---

## ✅ Phase 5: Local File Scanning (Tauri)

- [x] Tauri Rust command: `scan_audio_files` — recursive directory scan (mp3, wav, flac, ogg, aac, m4a, wma, opus)
- [x] Tauri command: returns file metadata (name, path, extension)
- [x] Tauri fs: read audio file as `Uint8Array` for Web Audio decoding
- [x] File browser UI component (scrollable geek-styled table)
- [x] Smart keyword matching: filename analysis → brainwave auto-recommendation
- [x] Drag-and-drop file support (Tauri `.path` API + drop zone validation)
- [x] Recently-opened files list (localStorage, max 8, quick-load buttons)

---

## ✅ Phase 6: Music Match Page (`/match`) — merged into `/generate`

- [x] Mood/Tempo/Genre selectors → removed (not useful; analysis is automatic)
- [x] FileBrowser + Binaural + AudioPlayer → merged into `/generate` (avoided duplication)

---

## ✅ Phase 7: Brainwave Generation Page (`/generate`) — now the main working page

- [x] Brainwave state selector grid (5 buttons with symbol + name + freq range)
- [x] Selected state description panel with benefit tags
- [x] Custom frequency slider (fine-tune within state's range)
- [x] FileBrowser: folder scan + smart keyword recommendations
- [x] Binaural beat explanation panel
- [x] Song recommendation cards (filtered by selected brainwave state)
- [x] Each card: title, artist, genre badge, bilingual description
- [x] "No recommendations" fallback UI
- [x] Merged: `/match` removed, all functionality unified on `/generate`

---

## ✅ Phase 8: Audio Player & Visualization

- [x] Canvas-based real-time frequency bar visualization
- [x] Bar colors match selected brainwave state
- [x] Status indicator: idle (grey dot) / playing (green pulsing dot) / paused (yellow dot)
- [x] Frequency range display (e.g., "Alpha · 8–13 Hz")
- [x] Error message display (red terminal-style alert)
- [x] Play / Pause / Stop button group (geek-styled)
- [x] Binaural beat volume slider with help text
- [x] Noise mask volume slider with help text
- [x] Music volume slider with help text
- [x] "Play with User Audio" button (mix binaural + uploaded music)
- [x] Export WAV / MP3 buttons

---

## ✅ Phase 9: Frequency Reference Panel

- [x] Static legend showing all 5 brainwave states (in BrainwaveSelector)
- [x] Color bar, name (zh/en), frequency range, icon for each state
- [x] Compact card design — appears in left sidebar on Match & Generate pages

---

## ✅ Phase 10: Routing & Navigation

- [x] `/` — Studio page (brainwave selector + song recs + file browser + binaural + AudioPlayer)
- [x] `/about` — About page (features, how it works, tech stack, disclaimer)
- [x] Home page removed — landing directly on studio saves a click
- [x] Route group layout: AppHeader + children + footer
- [x] `/match` removed — functionality merged into `/generate`
- [x] Loading skeletons (Suspense fallback, page layout matching)
- [x] Error boundary (root-level, geek-styled fatal error display)
- [x] 404 Not Found page (geek-styled)

---

## 🔄 Phase 11: Polish & QA

- [x] Full i18n coverage — all UI strings use translation keys, no mixed zh/en
- [x] Font size slider in header (10–25px range, persisted to localStorage)
- [x] Grid layout: 2-col continuous stacks (selector+audio | detail+songs), no gaps
- [x] Pages merged: `/match` removed, HomePage removed, `/` = studio
- [x] Developer credit: "Teng Zuo" in footer
- [x] UX flow redesign: Step 1 load audio → Step 2 select brainwave (with auto-detection) → Step 3 tune & play
- [x] Keyboard shortcuts (Space = play/pause, Esc = stop, 1-5 = brainwave states)
- [x] Error handling for all Tauri commands (better Rust messages + retry button)
- [x] Volume slider help text with per-brainwave-state recommendations
- [x] MP3 export (192kbps, alongside WAV)
- [x] About page (/about) — features, how it works, tech stack, disclaimer
- [x] Test on Windows build (`npm run tauri build`)
- [x] Consistent geek aesthetic audit (CSS variables verified, no hardcoded colors)
- [x] Performance profiling (FFT animFrame only runs when playing, canvas cleared on stop)
- [x] Explanatory text font size +50% (`text-[10px]`→`text-[15px]`, `text-xs`→`text-[18px]`)
- [ ] Smooth transitions between pages (N/A — single page app)
- [ ] Audio engine cleanup on route change (N/A — single page app)

---

## ✅ Phase 12: Carrier Frequency Control & Natural Sound Masking

- [x] audioEngine.ts: Replace hardcoded CARRIER_FREQ with instance state `_carrierFreq`
- [x] audioEngine.ts: Add `NatureSoundType` (brown/pink/white/ocean/rain/stream)
- [x] audioEngine.ts: Rewrite `createNoiseBuffer` with 6-way branching noise generator
  - brown: existing random-walk · pink: Paul Kellet 6-stage · white: raw random
  - ocean: brown + 0.12Hz tidal LFO · rain: high-pass + rapid density mod · stream: bandpass + irregular mod
- [x] audioEngine.ts: `setCarrierFrequency` with real-time `setTargetAtTime` oscillator update
- [x] audioEngine.ts: `setNatureSoundType` with cache invalidation + live buffer swap (no glitch)
- [x] audioEngine.ts: Rename `setBinauralVolume` → `setCarrierVolume` (public API)
- [x] audioEngine.ts: `buildGraph` uses dynamic `_carrierFreq`
- [x] audioEngine.ts: `exportAudio` uses dynamic carrier + includes nature sound layer
- [x] useAudioEngine.ts: Expose `carrierFreq`, `carrierVol`, `natureType` + setters
- [x] BrainSyncContext.tsx: Add `carrierFreq` / `natureType` to shared context
- [x] AudioPlayer.tsx: New 5-control layout (carrier freq, carrier vol, type selector, nature vol, music vol)
- [x] AudioPlayer.tsx: Warnings section (headphone reminder + carrier min volume tip)
- [x] GeneratePage.tsx: Dynamic carrier frequency in binaural explanation
- [x] translations.ts: 16 new keys (carrier freq/vol, 6 nature types, help texts, warnings)
- [x] translations.ts: Updated `binaural.carrier`, `about.howDesc3` (white noise → natural sound)
- [x] Verify: `npx tsc --noEmit` — zero errors

---

## ✅ Phase 14: Git Version Control Setup

- [x] Create standard `.gitignore` (node_modules, target, .env, dist, etc.)
- [x] Initialize local Git repository
- [x] Configure identity: Teng Zuo <zuoteng@gmail.com>
- [x] Initial commit: 75 files, 14,829 lines

---

## Quick Start

```bash
cd C:\Projects\brainwave-app
npm run tauri dev
```

---

> `[ ]` = pending · `[~]` = in progress · `[x]` = done
