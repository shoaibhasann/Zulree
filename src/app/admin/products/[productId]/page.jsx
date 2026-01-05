"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import api from "@/app/lib/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import VariantSummary from "@/app/admin/components/admin/VariantSummary";
import ImageCarousel from "../../components/admin/ImageCarousel";
import ProductDetailSkeleton from "../../components/admin/skeleton/ProductDetailSkeleton";
import { useProductActions } from "../../hooks/useProductActions";
import toast from "react-hot-toast";
import StockBadge from "../../components/admin/StockBadge";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { deleteProduct } = useProductActions();

  const stock = product?.hasVariants ? product?.availableStock : product?.stock;

  const handleDeleteVariant = async (variantId) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;
    const toastId = toast.loading("Deleting variant...");
    try {
      const { data } = await api.delete(
        `/api/v1/admin/products/${productId}/${variantId}`
      );
      if (data.success) {
        toast.success("Variant deleted successfully", { id: toastId });
        router.refresh();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete variant", { id: toastId });
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await api.get(`/api/v1/admin/products/${productId}`);
        if (data.success){
           setProduct(data.data);
        }
        
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to fetch product details")
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchProduct();
  }, [productId]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product)
    return <p className="text-admin-muted">Product not found</p>;

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-white font-semibold">{product.title}</h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/products/${productId}/edit`)}
          >
            Edit
          </Button>

          <Button
            variant="destructive"
            onClick={() => deleteProduct(productId)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* ================= CORE PRODUCT INFO ================= */}
      <Card className="bg-admin-foreground">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <ImageCarousel
              images={product.images}
              alt={product.title}
              size="lg"
            />

            {/* Details */}
            <div className="space-y-4">
              <p className="text-sm text-slate-50">{product.description}</p>

              <div className="flex gap-6 text-base">
                <span className="text-slate-100">
                  <span className="text-slate-300">Price:</span> ₹
                  {product.price}
                </span>
                <span classname="text-slate-50">
                  <span className="text-slate-100">Stock:</span>{" "}
                  <span className="text-slate-300">{stock}</span>
                </span>
              </div>

              <StockBadge stock={product.stock} />

              <p className="text-sm text-admin-muted">
                Category: {product.category?.main} {product.category.sub ? `/ ${product.category.sub}` : ""}
              </p>

              {product.hasVariants && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/admin/products/${productId}/variants/add`)
                  }
                >
                  Add Variant
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= VARIANTS SECTION ================= */}
      {product.hasVariants && product.variants?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Variants</h2>

          <div className="space-y-4">
            {product.variants.map((variant) => (
              <VariantSummary
                productId={productId}
                key={variant._id}
                variant={variant}
                onEdit={(v) => router.push(`/admin/variants/${v._id}/edit`)}
                onDelete={(v) => handleDeleteVariant(v._id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
