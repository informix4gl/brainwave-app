"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[BrainSync ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-8">
          <div className="max-w-lg w-full p-6 rounded-lg border border-red-400/30 bg-[var(--terminal)] font-mono text-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border)]">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-red-400 uppercase tracking-wider">
                [fatal] Uncaught Exception
              </span>
            </div>
            <pre className="text-red-400/80 mb-4 whitespace-pre-wrap leading-relaxed">
              {this.state.error.message}
            </pre>
            {this.state.error.stack && (
              <pre className="text-[var(--muted)]/40 text-[10px] max-h-40 overflow-y-auto mb-4 whitespace-pre-wrap leading-relaxed">
                {this.state.error.stack}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ error: null });
                window.location.reload();
              }}
              className="px-3 py-1.5 text-xs font-mono border border-[var(--border)] rounded text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
