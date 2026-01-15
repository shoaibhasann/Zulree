"use client";

import api from "@/app/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import RelatedProductsSkeleton from "./skeletons/RelatedProductsSkeleton";

export default function RelatedProducts({ slugProp }) {
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const matcher = slugProp || slug;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  

  useEffect(() => {
    async function fetchProducts(){
        setLoading(true);
        try {
            const { data } = await api.get(
              `/api/v1/products/related/${matcher}`
            );
            setProducts(data.data);
            console.log(data);
        } catch (err) {
            setError(err?.response?.data?.message || "Products not found");
        } finally {
            setLoading(false);
        }
    }

    fetchProducts();
  },[slugProp, matcher]);

  if(loading){
    return <div className="text-center text-base"><RelatedProductsSkeleton /></div>
  }

  if (error) return <p className="text-center py-20">{error}</p>;

  return (
    <section className="mt-16">
      {/* HEADING */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-heading">You may also like</h2>
        <p className="text-sm opacity-70 mt-1">Handpicked styles you’ll love</p>
      </div>

      {/* PRODUCTS */}
      <div
        className="
    flex gap-4
    overflow-x-auto
    touch-pan-x
    snap-x snap-mandatory
    pb-2
    md:grid md:grid-cols-4 md:gap-6 md:overflow-visible
  "
      >
        {products &&
          products.map((product) => (
            <ProductCard className="snap-start" key={product._id} p={product} />
          ))}
      </div>
    </section>
  );
}
