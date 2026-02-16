export function CartSummarySkeleton() {
  return (
    <div className="sticky top-20 rounded-xl border p-4 bg-white space-y-4 animate-pulse">
      <div className="h-4 w-1/2 bg-gray-200 rounded" />

      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded" />
      </div>

      <div className="h-px bg-gray-200" />

      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded-xl" />
    </div>
  );
}
