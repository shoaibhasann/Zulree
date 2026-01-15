export default function ProductImageGallerySkeleton() {
  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 animate-pulse">
      {/* LEFT THUMBNAILS */}
      <div className="flex w-full overflow-x-auto md:overflow-visible md:flex-col gap-4 md:w-24">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square rounded-md min-w-16 shimmer" />
        ))}
      </div>

      {/* MAIN IMAGE */}
      <div className="relative flex-1 aspect-square rounded-xl shimmer" />
    </div>
  );
}
