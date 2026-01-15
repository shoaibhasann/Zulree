"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import api from "@/app/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import AnimatedSearchInput from "./AnimatedSearchInput";
import ProductCard from "./ProductCard";
import { ProductSkeletonGrid } from "./skeletons/ProductSkeletonGrid";
import { usePathname } from "next/navigation";

export default function SearchOverlay({ isOpen, onClose }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if(isOpen){
      onClose();
    }
  }, [pathname]);

  useEffect(() => {
    if (!debouncedQuery) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/products?q=${debouncedQuery}`);
        if (res.data?.success) {
          setProducts(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedQuery]);

  if(!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-100
        bg-white
        transition-transform duration-900 ease-in-out
        ${isOpen ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="flex flex-col h-full">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 h-16 border-b shrink-0">
          <h2 className="text-lg font-medium opacity-0 md:opacity-100">
            Search
          </h2>

          <Image
            src="/ZULREE.png"
            alt="ZULREE"
            width={130}
            height={36}
            priority
          />

          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* INPUT */}
        <div className="px-6 py-6 shrink-0">
          <AnimatedSearchInput
            value={query}
            onChange={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div>

        {/* RESULTS (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto px-6 pb-10">
          <div className="max-w-6xl mx-auto">
            {loading && <ProductSkeletonGrid />}

            {!loading && products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            )}

            {!loading && debouncedQuery && products.length === 0 && (
              <p className="text-center text-sm opacity-60 mt-10">
                No products found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
