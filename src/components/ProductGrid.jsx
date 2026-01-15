"use client";

import api from "@/app/lib/api";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ProductSkeletonGrid } from "./skeletons/ProductSkeletonGrid";

export default function ProductGrid({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/products?category=${category}`);
      const data = response.data;
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!category) return;
    fetchProducts();
  }, [category]);

  if (loading) return <div className="px-6"><ProductSkeletonGrid /></div>;
  if (error) return <p className="px-6 text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-8">
      {products && products.map((p) => (
          <ProductCard p={p} key={p._id} />
      ))}
    </div>
  );
}
