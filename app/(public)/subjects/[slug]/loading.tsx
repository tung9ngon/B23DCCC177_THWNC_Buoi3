export default function Loading() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Đang tải">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200" />
      ))}
    </div>
  );
}
