export default function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-300/20 border-t-cyan-300 rounded-full animate-spin" />
        <span className="sr-only">Loading page…</span>
      </div>
    </div>
  );
}
