export function RestaurantSkeleton() {
  return (
    <div className="min-w-[280px] snap-start">
      <div className="flex gap-3 bg-gray-50 rounded-2xl p-3 animate-pulse">
        <div className="w-24 h-24 shrink-0 rounded-xl bg-gray-200" />
        <div className="flex-1 py-1 min-w-0">
          <div className="h-3.5 bg-gray-200 rounded-full w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded-full w-1/2 mb-3" />
          <div className="h-3 bg-gray-200 rounded-full w-2/3 mb-1.5" />
          <div className="h-3 bg-gray-200 rounded-full w-1/3" />
        </div>
      </div>
    </div>
  );
}
