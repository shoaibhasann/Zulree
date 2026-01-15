import ProductImageGallerySkeleton from "./ProductImageGallerySkeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
        {/* LEFT – IMAGE GALLERY */}
        <ProductImageGallerySkeleton />

        {/* RIGHT – PRODUCT INFO */}
        <div className="flex flex-col space-y-6">
          {/* Category */}
          <div className="h-3 w-24 rounded shimmer" />

          {/* Title */}
          <div className="space-y-3">
            <div className="h-8 w-3/4 rounded shimmer" />
            <div className="h-8 w-1/2 rounded shimmer" />
          </div>

          {/* Price */}
          <div className="h-6 w-40 rounded shimmer" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded shimmer" />
            <div className="h-4 w-full rounded shimmer" />
            <div className="h-4 w-4/5 rounded shimmer" />
          </div>

          {/* Button */}
          <div className="h-14 w-2/3 rounded-full shimmer" />

          {/* Trust text */}
          <div className="h-3 w-52 rounded shimmer" />

          {/* Specs */}
          <div className="pt-6 border-t space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-32 rounded shimmer" />
                <div className="h-3 w-24 rounded shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
