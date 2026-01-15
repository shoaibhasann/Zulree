import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";

export default function RelatedProductsSkeleton() {
  return (
    <section className="mt-16">
      {/* HEADING SKELETON */}
      <div className="mb-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>

      {/* CARDS */}
      <div
        className="
          flex gap-4
          overflow-x-auto
          md:grid md:grid-cols-4 md:gap-6
        "
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
