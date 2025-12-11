export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-background-softer border border-border rounded-xl p-5">
      <div className="h-6 bg-slate-700 rounded w-3/4 mb-3" />
      <div className="h-4 bg-slate-700 rounded w-1/3 mb-4" />
      <div className="h-3 bg-slate-700 rounded w-full mb-2" />
      <div className="h-3 bg-slate-700 rounded w-5/6 mb-2" />
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-20 bg-slate-700 rounded" />
        <div className="h-6 w-10 bg-slate-700 rounded" />
      </div>
    </div>
  );
}
