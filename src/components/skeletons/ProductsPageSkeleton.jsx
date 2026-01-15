import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductsPageSkeleton(){
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
}