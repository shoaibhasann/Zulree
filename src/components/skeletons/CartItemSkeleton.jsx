export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 border-b py-4 animate-pulse">
      <div className="w-24 h-32 bg-gray-200 rounded-md" />

      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />

        <div className="flex items-center gap-3 mt-3">
          <div className="h-8 w-28 bg-gray-200 rounded-md" />
          <div className="ml-auto h-4 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
