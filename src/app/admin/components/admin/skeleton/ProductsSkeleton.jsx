import { Skeleton } from "@/components/ui/skeleton";

export function ProductsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border border-slate-800">
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 items-center">
              <Skeleton className="h-4 col-span-2" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-8 w-8 justify-self-end" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
