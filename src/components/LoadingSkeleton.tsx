export default function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      {/* Banner skeleton */}
      <div className="mb-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
        <div className="h-3 w-48 bg-[var(--muted)]/20 rounded mb-2" />
        <div className="h-3 w-96 bg-[var(--muted)]/10 rounded" />
      </div>

      {/* Full-width card */}
      <div className="mb-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--terminal)]">
        <div className="h-4 w-32 bg-[var(--muted)]/20 rounded mb-3" />
        <div className="h-8 w-full bg-[var(--muted)]/10 rounded" />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--terminal)]">
            <div className="h-4 w-28 bg-[var(--muted)]/20 rounded mb-3" />
            <div className="grid grid-cols-2 gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-[var(--muted)]/10 rounded" />
              ))}
            </div>
          </div>
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--terminal)] h-64">
            <div className="h-4 w-24 bg-[var(--muted)]/20 rounded mb-3" />
            <div className="h-20 bg-[var(--muted)]/10 rounded mb-3" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-[var(--muted)]/10 rounded" />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--terminal)]">
            <div className="h-4 w-32 bg-[var(--muted)]/20 rounded mb-3" />
            <div className="h-32 bg-[var(--muted)]/10 rounded" />
          </div>
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--terminal)]">
            <div className="h-4 w-28 bg-[var(--muted)]/20 rounded mb-3" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-[var(--muted)]/10 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
