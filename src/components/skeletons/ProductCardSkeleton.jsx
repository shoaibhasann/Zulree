export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse min-w-40 md:min-w-0">
      <div className="aspect-square bg-gray-200 mb-3 rounded-sm" />
      <div className="h-4 bg-gray-200 mb-2 w-3/4 rounded" />
      <div className="h-4 bg-gray-200 w-1/3 rounded" />
    </div>
  );
}
