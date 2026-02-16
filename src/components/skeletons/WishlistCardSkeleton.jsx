export function WishlistCardSkeleton() {
  return (
    <div className="bg-white mb-5 shrink-0 animate-pulse">
      <div className="aspect-3/4 sm:aspect-square bg-gray-200 mb-3 rounded-md" />

      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />

      <div className="h-9 bg-gray-200 rounded-xl" />
    </div>
  );
}
