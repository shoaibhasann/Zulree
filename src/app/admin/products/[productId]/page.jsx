"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

function DetailSkeleton() {
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

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/v1/admin/products/${productId}`);
        const json = await res.json();
        if (json.success) setProduct(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (loading) return <DetailSkeleton />;

  if (!product) {
    return <p className="text-muted-foreground">Product not found</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{product.title}</h1>
        <div className="space-x-2">
          <Button onClick={() => router.push(`/admin/products/${productId}/edit`)} variant="outline">Edit</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Image */}
        <div className="rounded-md border border-slate-800 p-4">
          {/* <Image
            src={product.images?.[0]?.secure_url}
            alt={product.title}
            className="rounded-md w-full object-cover"
          /> */}
        </div>

        {/* Details */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{product.description}</p>

          <div className="flex gap-4 text-sm">
            <span>Price: ₹{product.price}</span>
            <span>Stock: {product.stock}</span>
          </div>

          <Badge>{product.stock > 0 ? "In stock" : "Out of stock"}</Badge>

          <p className="text-sm text-muted-foreground">
            Category: {product.category?.main} / {product.category?.sub}
          </p>
        </div>
      </div>
    </div>
  );
}
