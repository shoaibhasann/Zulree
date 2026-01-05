import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-64" />
      <Skeleton className="h-4 w-48" />

      <div className="grid grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full rounded-md" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}
