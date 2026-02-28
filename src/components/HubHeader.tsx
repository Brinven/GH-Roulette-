'use client';

export default function HubHeader() {
  return (
    <div className="sticky top-0 z-50 flex items-center gap-3 border-b border-white/[0.06] bg-zinc-950/80 px-4 py-2 backdrop-blur-sm">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `http://${window.location.hostname}:9000`;
        }}
        className="text-xs font-medium text-zinc-500 transition-colors hover:text-emerald-400"
      >
        &larr; Back to Hub
      </a>
      <span className="text-xs text-zinc-600">|</span>
      <span className="text-xs font-semibold text-zinc-300">GH Roulette</span>
    </div>
  );
}
