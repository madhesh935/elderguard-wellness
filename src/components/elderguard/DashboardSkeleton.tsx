export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton-shimmer h-44 rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-44 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="skeleton-shimmer h-72 rounded-2xl" />
        <div className="skeleton-shimmer h-72 rounded-2xl" />
      </div>
    </div>
  );
}
