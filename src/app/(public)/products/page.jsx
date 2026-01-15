"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import api from "@/app/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductsPageSkeleton from "@/components/skeletons/ProductsPageSkeleton";
import FilterSidebar from "@/components/FilterSidebar";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const params = Object.fromEntries(searchParams.entries());
      const { data } = await api.get("/api/v1/products", { params });
      setProducts(data.data || []);
      setLoading(false);
    }
    fetchProducts();
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* MOBILE FILTER BUTTON */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div className="md:grid md:grid-cols-[260px_1fr] md:gap-10">
        {/* FILTER SIDEBAR */}
        <FilterSidebar open={filterOpen} onClose={() => setFilterOpen(false)} />

        {/* PRODUCTS */}
        {loading ? (
          <ProductsPageSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
