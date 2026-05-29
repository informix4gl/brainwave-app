# Claude Code Project Guide: Tauri Audio App

This file provides critical context, commands, and code style guidelines for AI assistants working on this repository.

## 🛠️ Tech Stack
- **Backend/Desktop:** Tauri v2 (Rust)
- **Frontend Framework:** React 18 (TypeScript)
- **Styling:** Tailwind CSS v4 (CSS-first configuration)
- **Core Domain:** Web Audio API (Audio processing/visualizing)

## 🚀 Common Commands
### Development
- Run desktop app: `npm run tauri dev` or `cargo tauri dev`
- Frontend only: `npm run dev`
### Build & Test
- Build desktop app: `npm run tauri build`
- Run frontend tests: `npm run test`
- Check Rust code: `cargo check` & `cargo clippy`

## 📐 Code Style & Architecture Guidelines

### 1. Tauri v2 IPC Rules
- **Rust Commands:** Define in `src-tauri/src/commands/` or `lib.rs`. Use camelCase naming for command arguments to match frontend TypeScript seamlessly.
- **Frontend Invoke:** Always use the async/await pattern with proper try/catch blocks. Wrap calls in typed service functions (e.g., `src/services/tauriApi.ts`).
- **State Management:** Rust app state must be managed via `tauri::State`.

### 2. Web Audio API & React Integration
- **Lifecycle Management:** Any `AudioContext` or audio nodes created inside a React component MUST be cleaned up in the `useEffect` return function.
- **State Updates:** Avoid triggering frequent React state updates (e.g., 60fps) from `AnalyserNode.getByteFrequencyData` via standard `useState`. Use `requestAnimationFrame` and direct DOM/Canvas manipulation or Refs for audio visualizers.

### 3. Tailwind v4 Styling
- DO NOT create or look for `tailwind.config.js`.
- All design tokens, custom animations, and theme extensions must be declared using the `@theme` directive in `src/index.css`.

### 4. TypeScript & Rust Consistency
- Maintain shared data structures. If a struct changes in Rust (e.g., audio metadata format), its corresponding interface in `src/types/` must be updated manually.
