<p align="center">
  <pre style="color: #a78bfa; line-height: 1.1;">
  ██████╗ ██████╗  █████╗ ██╗███╗   ██╗███████╗██╗   ██╗███╗   ██╗ ██████╗
  ██╔══██╗██╔══██╗██╔══██╗██║████╗  ██║██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝
  ██████╔╝██████╔╝███████║██║██╔██╗ ██║███████╗ ╚████╔╝ ██╔██╗ ██║██║
  ██╔══██╗██╔══██╗██╔══██║██║██║╚██╗██║╚════██║  ╚██╔╝  ██║╚██╗██║██║
  ██████╔╝██║  ██║██║  ██║██║██║ ╚████║███████║   ██║   ██║ ╚████║╚██████╗
  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═══╝ ╚═════╝
  </pre>
</p>

<p align="center"><strong>v0.1.1</strong> — Brainwave Entrainment Desktop App · 脑波同化音乐桌面应用</p>
<p align="center">Tauri v2 + React 18 + TypeScript · Web Audio API · Geek/Hacker Terminal Aesthetic · 中/EN 双语</p>

---

## What is BrainSync? · 什么是 BrainSync？

BrainSync is a **desktop brainwave entrainment tool**. It generates precisely tuned binaural beats that guide your brain into specific neural states — Delta (deep sleep), Theta (meditation), Alpha (relaxed focus), Beta (active concentration), or Gamma (peak energy). Load your own music, pick a state, and BrainSync layers a sub-audible binaural carrier underneath. Your music drives the experience; the beat does the work.

BrainSync 是一款桌面脑波同化工具。通过精确的双耳节拍频率刺激，引导大脑进入 Delta（深度睡眠）、Theta（冥想）、Alpha（放松专注）、Beta（活跃思考）或 Gamma（巅峰能量）等状态。载入本地音乐，选择脑波状态，BrainSync 将在底层叠加双耳节拍载波——你听音乐，节拍在幕后完成同化。

The audio pipeline combines **three layers**: a pure sine-wave carrier tone (left/right ears receive slightly different frequencies to create the perceived "beat"), a selectable **nature sound mask** (ocean, rain, stream, brown/pink/white noise), and **your music** — MP3, WAV, FLAC, OGG, AAC, M4A, WMA, or Opus.

音频管道叠加三层：纯正弦载波音（左右耳频率差产生大脑感知的"节拍"）、可选的自然音效遮蔽（海浪/雨声/溪流/粉噪/棕噪/白噪）、以及你的本地音乐。

---

## 🧠 Brainwave States · 脑波状态

| State | Freq (Hz) | Mental State | 中文 |
|-------|-----------|-------------|------|
| **δ Delta** | 0.5 – 4 | Deep sleep, healing, pain relief | 深度睡眠、修复、镇痛 |
| **θ Theta** | 4 – 8 | Meditation, creativity, emotional healing | 冥想、创作、情绪疗愈 |
| **α Alpha** | 8 – 13 | Calm focus, stress relief, learning | 放松专注、减压、学习 |
| **β Beta** | 13 – 30 | Concentration, problem solving, energy | 专注、解决问题、活力 |
| **γ Gamma** | 30 – 50 | Peak focus, memory, insight | 巅峰专注、记忆、洞察 |

---

## ⚡ Quantum Sync — Advanced Dynamic Synchronization · 量子同化引擎

The Quantum Sync engine prevents **neural habituation** — the brain's tendency to tune out static, unchanging stimulation. It applies four simultaneous modulation layers to keep the entrainment signal perpetually novel:

量子同化引擎通过四层并行调制机制防止大脑对静态刺激产生**习惯化适应**，维持脑波引导的长期有效性：

| Layer · 层级 | Mechanism · 机制 | Range · 范围 |
|-------|-----------|-------|
| **μ-Sweep · 微扫频** | Ultra-slow sinusoidal micro-sweep (~37 s period) | ±0.5 Hz |
| **Chaotic Drift · 混沌漂移** | 4 incommensurate sine oscillators producing non-repeating pseudo-random walk | ±0.15 Hz |
| **φ Harmonic · 黄金副谐波** | Golden-ratio (0.618) secondary beat frequency as an additional synchronization anchor | 0.1–1.5× primary |
| **Tidal AM · 潮汐振幅呼吸** | Low-frequency LFO amplitude modulation, mimicking natural brainwave amplitude fluctuations | 0.02–0.5 Hz |

### Sync Target Nodes · 同化目标节点

One-click scientific presets that auto-configure all four modulation parameters and switch the brainwave state:

一键科学预设，自动配置全部四项调制参数并联动脑波状态切换：

| Node | Brainwave | AM Rate | AM Depth | φ Factor | Sweep | Experience |
|------|-----------|---------|----------|----------|-------|------------|
| **Node-10 · Somatic Hibernation** | Theta | 0.06 Hz | 12% | 0.618 | ±0.4 Hz | Deep body-asleep / mind-awake state |
| **Node-12 · Core Expansion** | Alpha | 0.10 Hz | 25% | 0.618 | ±0.6 Hz | Expanded awareness / heightened perception |

Toggle via the neon `[进阶模式: 量子同化]` button or press **Q**. Preset-lock UX disables dependent sliders when a node is active; switching brainwave manually auto-exits the preset.

通过霓虹发光按钮或按 **Q** 键开启。预设锁定 UX：激活节点时禁用受控滑块；手动切换脑波自动退出预设。

---

## 🔍 Meta + BPM Dual Anti-Interference Audit · 元数据 + BPM 双重防干扰审计

Before recommending or loading a track, BrainSync runs a **two-layer audit** to prevent high-interference audio from undermining deep entrainment states:

在推荐或载入曲目前，BrainSync 执行双层级审计，防止高干扰音频破坏深度同化状态：

**Layer 1 — Genre Blacklist · 流派黑名单**
22 high-interference genre keywords: Rap, Hiphop, Rock, Metal, Punk, Dubstep, Drum & Bass, Hardcore, Hardstyle, Trap, Drill, Grime, Industrial, Screamo, Death Metal, Black Metal, Thrash, and more. Fuzzy word-level matching catches sub-genre variants.

22 个高干扰流派关键词：Rap、Hiphop、Rock、Metal、Punk、Dubstep、Drum & Bass、Hardcore、Hardstyle、Trap、Drill 等。模糊逐词匹配捕获子流派变体。

**Layer 2 — BPM Threshold · 节奏阈值**
Tracks exceeding **120 BPM** are flagged as high-interference rhythm carriers. BPM is detected via energy-envelope autocorrelation on the decoded audio buffer — no external library needed.

BPM 超过 **120** 的曲目标记为高干扰节奏载体。通过能量包络自相关算法在解码后的音频缓冲上直接检测——无需外部库。

**Protected States · 受保护状态**: Delta, Theta, Alpha — automatically reject interference-heavy tracks. When a flagged track is force-loaded anyway, a **red/amber cyberpunk terminal alert panel** displays genre hits, BPM value, and a recommendation to switch to Ambient / Lofi / instrumental low-BPM material.

Delta、Theta、Alpha 状态自动拦截高干扰曲目。若用户强制载入被标记曲目，界面弹出红/琥珀色赛博终端警报面板，显示命中流派、BPM 值及切换建议。

---

## 🎛️ Key Features · 核心功能

- **5 Brainwave States** with custom frequency sliders (fine-tune within each state's range)
- **Tunable Carrier Frequency** (100–500 Hz, default 320 Hz near E4) for tonal comfort
- **6 Nature Sound Masks**: Ocean, Rain, Stream, Brown, Pink, White noise — seamless live switching with zero glitch
- **3-Layer Mixing**: carrier tone + nature sound + user music, independent per-layer volume control
- **Local File Scanning** via Tauri Rust backend — recursive directory scan for 8 audio formats with ID3 metadata extraction
- **Smart Multi-Signal Analysis**: filename keywords + ID3 metadata (genre/BPM) + audio features (spectral centroid, energy distribution) → brainwave matching
- **Real-time FFT Visualization**: 48-bar spectrum, color-themed per brainwave state, `<canvas>` rendered
- **42 Curated Song Recommendations** (8 per state, bilingual Chinese/English)
- **WAV/MP3 Export** with async progress tracking and auto-open-folder option
- **Collapsible Help Texts** — 2-line clamp by default, expandable via 更多/More toggle
- **Dark Geek Theme** with scanline overlay, glitch text effects, terminal-inspired UI
- **Full i18n** (简体中文 / English) — 300+ translation keys, zero hardcoded strings
- **Keyboard Shortcuts**: 1–5 brainwave states, Space play/pause, Esc stop, Q Quantum Sync

---

## ⌨️ Keyboard Shortcuts · 快捷键

| Key | Action · 操作 |
|-----|--------|
| `1`–`5` | Switch brainwave state (Delta → Gamma) · 切换脑波 |
| `Space` | Play / Pause · 播放/暂停 |
| `Esc` | Stop · 停止 |
| `Q` | Toggle Quantum Sync Pro-Mode · 量子同化开关 |

---

## 🛠️ Tech Stack · 技术栈

| Layer | Technology |
|-------|-----------|
| Desktop Shell | Tauri v2 (Rust) — ~5 MB binary |
| Frontend | React 18 + TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Audio Engine | Web Audio API (OscillatorNode, AudioBuffer, AnalyserNode, OfflineAudioContext) |
| Audio Analysis | Spectral centroid, energy distribution, BPM autocorrelation |
| Metadata | ID3 (Rust `id3` crate) |
| Export | WAV (PCM header construction) / MP3 (lamejs, 192 kbps) |
| Build | Vite 8 |
| CI/CD | GitHub Actions — tauri-apps/tauri-action + softprops/action-gh-release |

---

## 🚀 Quick Start · 快速启动

```bash
cd brainwave-app
npm install
npx tauri dev
```

**Prerequisites · 前置条件**: Node.js 22+, Rust 1.77+, Windows 10+ / macOS 13+ / Ubuntu 22.04+

```bash
# TypeScript check (zero errors required)
npx tsc -b --noEmit

# Production build
npx tauri build
```

---

## 📂 Project Structure · 项目结构

```
brainwave-app/
├── src/
│   ├── components/          # AudioPlayer, FileBrowser, SongRecommendations, ui/
│   ├── context/             # BrainSyncContext (shared state)
│   ├── data/                # 42 curated song recommendations
│   ├── hooks/               # useAudioEngine bridge hook
│   ├── i18n/                # zh/en translation dictionary (300+ keys)
│   ├── pages/               # GeneratePage (studio), AboutPage, NotFoundPage
│   ├── services/            # DynamicSyncModulator (Quantum Sync algorithm)
│   └── utils/               # audioEngine, audioAnalyzer, fileScanner, interferenceDetector, brainwaveFrequencies
├── src-tauri/               # Rust backend (file scanning, ID3, file I/O)
├── .github/workflows/       # release.yml (cross-platform CI/CD)
├── CHANGELOG.md             # Full version history
└── Todo.md                  # Development roadmap
```

---

## ⚠️ Disclaimer · 免责声明

BrainSync is **not a medical device**. Binaural beat effects vary between individuals. Consult a physician if you have epilepsy, auditory sensitivity, or other health conditions. Use in safe environments — do not use while driving or operating machinery.

BrainSync **不构成医疗建议**。双耳节拍效果因人而异。如有癫痫、听觉敏感或其他健康状况，请在使用前咨询医生。建议在安全环境中使用，避免驾驶或操作机械时佩戴。

---

## ❤️ Credits · 特别谢忱

**Teng Zuo** — design, development, and geek aesthetic direction.

**Michael Wu** — special thanks for sharing knowledge about The Monroe Institute's Hemi-Sync technology, which directly inspired the Quantum Sync dynamic modulation engine.

---

<p align="center">
  <em>"The mind is not a vessel to be filled, but a fire to be kindled."</em><br>
  <em>"头脑不是待填充的容器，而是待点燃的火焰。" — Plutarch</em>
</p>

<p align="center">Tech is nothing without a community of curious minds.</p>
