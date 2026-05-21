# BrainSync · 脑波同化

```
 ██████╗ ██████╗   █████╗  ██╗ ███╗   ██╗ ███████╗██╗   ██╗ ███╗   ██╗  ██████╗
 ██╔══██╗██╔══██╗ ██╔══██╗ ██║ ████╗  ██║ ██╔════╝╚██╗ ██╔╝ ████╗  ██║ ██╔════╝
 ██████╔╝██████╔╝ ███████║ ██║ ██╔██╗ ██║ ███████╗ ╚████╔╝  ██╔██╗ ██║ ██║
 ██╔══██╗██╔══██╗ ██╔══██║ ██║ ██║╚██╗██║ ╚════██║  ╚██╔╝   ██║╚██╗██║ ██║
 ██████╔╝██║  ██║ ██║  ██║ ██║ ██║ ╚████║ ███████║   ██║    ██║ ╚████║ ╚██████╗
 ╚═════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝ ╚═╝  ╚═══╝ ╚══════╝   ╚═╝    ╚═╝  ╚═══╝  ╚═════╝
```

> **Brainwave Entrainment Music Desktop App** · 脑波同化音乐桌面应用
>
> Tune your mind. Load local music. Let BrainSync analyze, match, and layer binaural beats —
> guiding your brain into Delta, Theta, Alpha, Beta, or Gamma states.

---

## 📡 What is BrainSync? · 什么是 BrainSync？

BrainSync is a **desktop brainwave entrainment tool** built with Tauri + React. It combines three technologies into a single audio pipeline:

| Layer | Purpose | 用途 |
|-------|---------|------|
| **Carrier Tone** | Pure sine wave — the vehicle for binaural beats. Left/right ears receive slightly different frequencies (e.g. 320 Hz vs 330 Hz). The brain perceives the difference as a 10 Hz "beat." | 纯正弦载波，左右耳频率差产生双耳节拍 |
| **Nature Sound Mask** | Ocean / Rain / Stream / Brown / Pink / White noise. Softens the carrier tone and masks environmental noise — without burying the beat. | 自然音效柔化载波、遮蔽环境噪音 |
| **Your Music** | MP3 / WAV / FLAC / OGG / AAC / M4A / WMA / Opus files. Loaded, analyzed, and mixed into the output. | 你的本地音乐，经分析后混入输出 |

The result: a 3-layer audio stream where the binaural beat entrains your brainwaves while your favorite music plays — masked by soothing natural sound.

输出：三层叠加音频流 —— 双耳节拍引导脑波，你喜爱的音乐同时播放，自然音效柔化听感。

---

## 🧠 Brainwave States · 脑波状态

| State | Freq (Hz) | Mental State | 中文 |
|-------|-----------|-------------|------|
| **δ Delta** | 0.5 – 4 | Deep sleep, healing, pain relief | 深度睡眠、修复、镇痛 |
| **θ Theta** | 4 – 8 | Meditation, creativity, emotional healing | 冥想、创作、情绪疗愈 |
| **α Alpha** | 8 – 13 | Calm focus, stress relief, learning | 放松专注、减压、学习 |
| **β Beta** | 13 – 30 | Concentration, problem solving, energy | 专注、解决问题、活力 |
| **γ Gamma** | 30 – 50 | Peak focus, memory, insight | 巅峰专注、记忆、洞察 |

Each state has 8 recommended songs (42 total), covering ambient, classical, jazz, pop, rock, and Chinese-language tracks — hand-picked for entrainment compatibility.

每种脑波状态推荐 8 首曲目（共 42 首），涵盖氛围、古典、爵士、流行、摇滚及中文歌曲。

---

## 🛠️ Tech Stack · 核心技术栈

```
┌──────────────────────────────────────────────────┐
│  Desktop Shell          Tauri v2 (Rust)           │
│  UI Framework           React 19 + TypeScript     │
│  Styling                Tailwind CSS v4           │
│  Build Tool             Vite 8                    │
│  Audio Engine           Web Audio API             │
│  Audio Analysis         Spectral centroid / RMS   │
│  Metadata               ID3 (Rust crate)          │
│  Export                 WAV (PCM) / MP3 (lamejs)  │
│  Visualization          FFT (AnalyserNode)        │
│  IPC                    Tauri invoke (JSON-RPC)   │
└──────────────────────────────────────────────────┘
```

### Why Tauri? · 为什么选 Tauri？

- **~5 MB** binary vs Electron's ~120 MB
- Rust backend for file I/O, ID3 parsing, and cross-platform file writing
- Direct access to the filesystem without Node.js polyfills
- Chromium WebView for Web Audio API (essential for `AudioContext`)

### Why Web Audio API? · 为什么选 Web Audio API？

- **`OscillatorNode`** for generating precise sine-wave carrier tones
- **`AudioBufferSourceNode`** for user audio playback
- **`AnalyserNode`** for real-time FFT visualization (48-bar spectrum)
- **`OfflineAudioContext`** for headless export rendering (WAV/MP3)
- Sub-millisecond scheduling precision via `currentTime`

---

## 🔬 Architecture · 实现原理

### Binaural Beat Generation · 双耳节拍生成

```
 Left Ear:  carrier_freq          (e.g. 320 Hz)    纯正弦波
 Right Ear: carrier_freq + beat   (e.g. 330 Hz)    纯正弦波 + 10 Hz 偏移
                           ↓
         Brain perceives: |330 - 320| = 10 Hz beat  大脑感知 10 Hz 节拍
```

The carrier frequency is user-tunable (100–500 Hz, default 320 Hz near E4). The beat frequency is determined by the selected brainwave state. Both oscillators are synced via `OscillatorNode.frequency.setTargetAtTime()`.

载波频率可调（100–500 Hz，默认 320 Hz 接近 E4 音高）。节拍频率由所选脑波状态决定。双振荡器通过 `setTargetAtTime` 同步。

### Audio Analysis Pipeline · 音频分析管道

```
 File → Rust (scan_dir_recursive) → AudioFileInfo[]
                                    ↓
          ┌─ Filename Keywords ───────────┐
          ├─ ID3 Metadata (genre, BPM) ───┤──→ Brainwave Score → Recommendation
          └─ Audio Features (FFT, RMS) ───┘
```

1. **Filename keywords**: 90+ Chinese/English keywords mapped to brainwave states (e.g. "sleep" → Delta, "focus" → Beta)
2. **ID3 metadata**: Genre and BPM extracted via Rust `id3` crate
3. **Audio features**: Spectral centroid (`AnalyserNode.getByteFrequencyData`) and RMS energy — routed through a weighted scoring algorithm

1. **文件名关键词**：90+ 中英文关键词映射到脑波状态（如"睡眠"→Delta，"专注"→Beta）
2. **ID3 元数据**：通过 Rust `id3` crate 提取流派与 BPM
3. **音频特征**：频谱重心（`AnalyserNode.getByteFrequencyData`）与 RMS 能量，经加权评分算法

### Smart Multi-Signal Analysis · 智能多信号分析

The recommendation engine combines three independent signals into a unified brainwave score:

```
Score(brainwave) = 0.35 × KeywordScore + 0.30 × MetadataScore + 0.35 × AudioFeatureScore
```

- **Keyword Score**: Normalized Levenshtein distance on filename tokens
- **Metadata Score**: Genre-to-brainwave lookup table + BPM range mapping
- **Audio Feature Score**: Spectral centroid position mapped to brainwave frequency bands

推荐引擎将三个独立信号融合为统一脑波评分。关键词评分基于文件名令牌的归一化编辑距离；元数据评分基于流派-脑波查找表 + BPM 区间映射；音频特征评分基于频谱重心位置映射到脑波频段。

### Export Pipeline · 导出管道

```
 OfflineAudioContext (render) → AudioBuffer (PCM Float32)
                                    ↓
              ┌─ WAV ────→ audioBufferToWavBlob()  → .wav (lossless)
              └─ MP3 ────→ audioBufferToMp3Blob()  → .mp3 (192 kbps)
                                    ↓
                   Tauri invoke("write_file_bytes")  → Disk
```

- WAV: Direct PCM → WAV header construction (zero dependencies)
- MP3: 30-second audio → ~1,150 encoding blocks, with async event-loop yielding every 20 blocks so the UI remains responsive with real-time progress (`渲染中` → `编码中: 5%` → ... → `组装中` → `保存中`)

WAV：直接 PCM → WAV 头构建（零依赖）。MP3：30 秒音频 → ~1,150 个编码块，每 20 块异步让出事件循环，UI 保持响应并显示实时进度。

---

## 🚀 Local Development · 本地开发

### Prerequisites · 前置条件

| Tool | Version | Check |
|------|---------|-------|
| Node.js | ≥ 20 | `node -v` |
| Rust | ≥ 1.77 | `rustc --version` |
| Windows Build Tools | VS Build Tools | Required for Tauri on Windows |

### Quick Start · 快速启动

```bash
# 1. Clone & enter
cd C:\Projects\brainwave-app

# 2. Install frontend dependencies
npm install

# 3. Start dev (Vite + Tauri)
npx tauri dev
```

### ⚠️ Memory Tip for Windows · Windows 内存提示

Rust compilation on Windows can consume significant RAM. If you have ≤ 16 GB, limit parallel jobs:

```powershell
# PowerShell — limit to 2 parallel Rust build jobs
$env:CARGO_BUILD_JOBS = 2
npx tauri dev
```

Or set it globally for the session:

```powershell
[System.Environment]::SetEnvironmentVariable('CARGO_BUILD_JOBS', '2', 'User')
```

This prevents `cargo` from spawning too many concurrent `rustc` processes and exhausting system memory during linking.

限制并行编译任务数，防止 `cargo` 产生过多并发 `rustc` 进程耗尽系统内存。

### Dev Server Only (frontend hot-reload)

```bash
npm run dev          # Vite on http://localhost:1420
```

### TypeScript Check

```bash
npx tsc -b --noEmit  # Full project reference check (zero errors required)
```

---

## 📦 Production Build · 正式打包

```bash
# Full production build (Vite + Rust release)
npx tauri build
```

This produces:
- **Windows**: `src-tauri/target/release/bundle/msi/BrainSync_*.msi`
- **macOS**: `src-tauri/target/release/bundle/dmg/BrainSync_*.dmg`
- **Linux**: `src-tauri/target/release/bundle/deb/BrainSync_*.deb`

### Build Optimizations · 构建优化

| Flag | Effect |
|------|--------|
| `$env:CARGO_BUILD_JOBS=2` | Limit parallel Rust compilation (memory-constrained systems) |
| `TAURI_DEBUG=0` | Minified frontend + release Rust profile |
| `--target x86_64-pc-windows-msvc` | Cross-compile target (if needed) |

### Signing (Windows)

For code signing on Windows, place your `.pfx` certificate and configure in `tauri.conf.json`:

```json
"windows": {
  "signCommand": "signtool sign /fd SHA256 /f cert.pfx /p %CERT_PASSWORD% %1"
}
```

---

## 📂 Project Structure · 项目结构

```
brainwave-app/
├── src/
│   ├── components/          # React UI components
│   │   ├── AudioPlayer.tsx  # Transport controls, FFT viz, export
│   │   ├── FileBrowser.tsx  # Directory scan, file table, recommendations
│   │   ├── SongRecommendations.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   └── AppHeader.tsx
│   │   └── ui/              # Geek-styled primitives (react-95 inspired)
│   ├── context/
│   │   └── BrainSyncContext.tsx  # Global state (brainwave, frequency, audio)
│   ├── data/
│   │   └── songRecommendations.ts  # 42 curated song recommendations
│   ├── hooks/
│   │   └── useAudioEngine.ts     # Audio engine bridge hook
│   ├── i18n/
│   │   ├── translations.ts       # zh/en translation map (250+ keys)
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/
│   │   ├── GeneratePage.tsx      # Main studio page
│   │   ├── AboutPage.tsx         # About / documentation
│   │   └── NotFoundPage.tsx
│   ├── types/
│   │   └── lamejs.d.ts           # Type declarations for window.lamejs
│   ├── utils/
│   │   ├── audioEngine.ts        # Core: AudioContext graph, binaural beats, export
│   │   ├── audioAnalyzer.ts      # Spectral centroid, RMS, brainwave scoring
│   │   ├── brainwaveFrequencies.ts  # State definitions, frequency ranges
│   │   └── fileScanner.ts        # Rust backend communication
│   ├── index.css                 # Tailwind + geek theme
│   ├── main.tsx                  # Entry point
│   └── App.tsx                   # Router
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs                # Tauri commands (scan, read, write, metadata, explorer)
│   │   └── main.rs               # Tauri entry point
│   ├── Cargo.toml                # Rust dependencies (tauri, serde, id3)
│   ├── tauri.conf.json           # Window config, permissions
│   ├── capabilities/
│   │   └── default.json          # fs, dialog permissions
│   └── icons/                    # App icons (all platform sizes)
├── public/
│   ├── lame.min.js               # MP3 encoder (classic <script> load, bypasses CJS interop)
│   └── favicon.svg
├── index.html
├── vite.config.ts
├── tsconfig.json                 # Project references root
├── tsconfig.app.json             # Strict frontend config (noUnusedLocals, etc.)
├── package.json
└── README.md
```

---

## 🎛️ Key Features · 核心功能

- **5 Brainwave States** with detailed descriptions and default frequency presets
- **Recursive Folder Scan** for 8 audio formats with Rust-powered ID3 metadata extraction
- **Smart Multi-Signal Analysis**: filename keywords + ID3 metadata + audio features → brainwave matching
- **Real-time FFT Visualization**: 48-bar spectrum, color-themed per brainwave state, `<canvas>` rendered
- **Tunable Carrier Frequency** (100–500 Hz) with one-click recommended defaults
- **6 Nature Sound Types** (Ocean, Rain, Stream, Brown, Pink, White) with tunable volume
- **3-Layer Mixing**: carrier tone + nature sound + user music, independent per-layer volume control
- **42 Curated Song Recommendations** (8 per state, bilingual Chinese/English)
- **WAV/MP3 Export** with async progress tracking and auto-open-folder after export
- **Dark Geek Theme** with scanline overlay, glitch text effects, terminal-inspired UI
- **Full i18n** (简体中文 / English) — 250+ translation keys
- **Keyboard Shortcuts**: 1–5 switch brainwave states, Space play/pause, Esc stop

---

## ⚠️ Disclaimer · 免责声明

BrainSync is **not a medical device**. Binaural beat effects vary between individuals.
Consult a physician if you have epilepsy, auditory sensitivity, or other health conditions.
Use in safe environments — do not use while driving or operating machinery.

BrainSync **不构成医疗建议**。双耳节拍效果因人而异。如有癫痫、听觉敏感或其他健康状况，请在使用前咨询医生。建议在安全环境中使用，避免驾驶或操作机械时佩戴。

---

## 📜 License

MIT · [Teng Zuo](mailto:zuoteng@gmail.com)

---

```
    "The mind is not a vessel to be filled, but a fire to be kindled."
    "头脑不是待填充的容器，而是待点燃的火焰。" — Plutarch
```
