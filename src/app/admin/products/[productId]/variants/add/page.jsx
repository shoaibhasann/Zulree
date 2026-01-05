"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import api from "@/app/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import ProductCard from "@/app/admin/components/admin/ProductCard";
import ImageUploader from "@/app/admin/components/admin/ImageUploader";
import ImageCarousel from "@/app/admin/components/admin/ImageCarousel";
import toast from "react-hot-toast";

export default function AddVariantPage() {
  const { productId } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [variant, setVariant] = useState({
    color: "",
    isActive: true,
    images: [],
    sizes: [],
  });

  /* -------------------- FETCH PRODUCT -------------------- */
  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await api.get(`/api/v1/admin/products/${productId}`);
        if (data.success){
          setProduct(data.data);
          console.log(data.data)
        };
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    }

    if (productId) fetchProduct();
  }, [productId]);

  /* -------------------- SKU SUGGESTER -------------------- */
  const suggestSku = (productSku, color, size) => {
    if (!productSku || !color || !size) return "";
    return `${productSku}-${color}-${size}`.toLowerCase().replace(/\s+/g, "-");
  };

  /* -------------------- ADD SIZE -------------------- */
  const addSize = () => {
    setVariant((prev) => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        {
          size: "",
          stock: 0,
          sku: "",
          isActive: true,
          isSkuManual: false,
        },
      ],
    }));
  };

  /* -------------------- UPDATE SIZE / STOCK -------------------- */
  const updateSize = (index, field, value) => {
    setVariant((prev) => {
      const updated = [...prev.sizes];
      updated[index][field] = value;

      // 🔥 Auto SKU only if admin has NOT manually edited
      if (field === "size" && !updated[index].isSkuManual) {
        updated[index].sku = suggestSku(product.sku, prev.color, value);
      }

      return { ...prev, sizes: updated };
    });
  };

  /* -------------------- MANUAL SKU EDIT -------------------- */
  const updateSkuManually = (index, value) => {
    setVariant((prev) => {
      const updated = [...prev.sizes];
      updated[index].sku = value;
      updated[index].isSkuManual = true;
      return { ...prev, sizes: updated };
    });
  };

  /* -------------------- REMOVE SIZE -------------------- */
  const removeSize = (index) => {
    setVariant((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  /* -------------------- COLOR CHANGE (AUTO SKU UPDATE) -------------------- */
  const updateColor = (value) => {
    setVariant((prev) => ({
      ...prev,
      color: value,
      sizes: prev.sizes.map((s) =>
        s.isSkuManual
          ? s
          : {
              ...s,
              sku: suggestSku(product.sku, value, s.size),
            }
      ),
    }));
  };

const handleImageUpload = (images) => {

  console.log("data from widget", images);
  setVariant((prev) => ({
    ...prev,
    images: Array.isArray(images)
      ? [...prev.images, ...images]
      : [...prev.images, images],
  }));
};




  /* -------------------- SUBMIT -------------------- */
  const submitVariant = async () => {
    if (!variant.color || variant.sizes.length === 0) {
      toast.error("Color and at least one size are required");
      return;
    }

    setSaving(true);
    try {
      const { data } = await api.post(
        `/api/v1/admin/products/${productId}/variant`,
        variant
      );

      if (data.success) {
        toast.success("Variant created successfully");
        router.push(`/admin/products/${productId}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create variant");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------- UI STATES -------------------- */
  if (pageLoading) return <Skeleton className="h-32 w-full" />;
  if (!product)
    return <p className="text-admin-muted">Product not found</p>;

  /* -------------------- JSX -------------------- */
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-white font-semibold">Add Variant</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      {/* Product Preview */}
      <ProductCard product={product} />

      {/* Variant Image Uploader */}
      {product.variants && product.variants.length >= 1 && (
        <ImageUploader onUploadSuccess={handleImageUpload} />
      )}

      {/* Image preview */}
      {
        variant.images && variant.images.length > 0 && (
          <ImageCarousel images={variant.images} alt={variant.color}  />
        )
      }

      {/* Variant Info */}
      <Card className="bg-admin-foreground text-white">
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label className="mb-2">Color</Label>
            <Input
              placeholder="Red, Gold, Green"
              value={variant.color}
              onChange={(e) => updateColor(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              className="text-admin-foreground"
              checked={variant.isActive}
              onCheckedChange={(v) => setVariant({ ...variant, isActive: v })}
            />
            <Label>Variant Active</Label>
          </div>
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card className="bg-admin-foreground">
        <CardContent className="space-y-4 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-slate-100 font-medium">Sizes</h2>
            <Button variant="outline" onClick={addSize}>
              + Add Size
            </Button>
          </div>

          {variant.sizes.map((s, index) => (
            <div
              key={index}
              className=" text-white grid grid-cols-5 gap-3 border p-3 rounded-md"
            >
              <div>
                <Label className="mb-2">Size</Label>
                <Input
                  value={s.size}
                  onChange={(e) => updateSize(index, "size", e.target.value)}
                />
              </div>

              <div>
                <Label className="mb-2">Stock</Label>
                <Input
                  type="number"
                  min={0}
                  value={s.stock}
                  onChange={(e) =>
                    updateSize(index, "stock", Number(e.target.value))
                  }
                />
              </div>

              <div>
                <Label className="mb-2">SKU</Label>
                <Input
                  value={s.sku}
                  onChange={(e) => updateSkuManually(index, e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 mt-6">
                <Checkbox
                  checked={s.isActive}
                  onCheckedChange={(v) => updateSize(index, "isActive", v)}
                />
                <Label>Active</Label>
              </div>

              <Button
                variant="destructive"
                className="mt-5"
                onClick={() => removeSize(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={submitVariant} disabled={saving} className="w-full text-white">
        {saving ? "Saving Variant..." : "Create Variant"}
      </Button>
    </div>
  );
}
