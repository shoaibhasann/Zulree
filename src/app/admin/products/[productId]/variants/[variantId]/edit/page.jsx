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
import ImageCarousel from "@/app/admin/components/admin/ImageCarousel";
import ImageUploader from "@/app/admin/components/admin/ImageUploader";
import toast from "react-hot-toast";

export default function VariantEditPage() {
  const { productId, variantId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [variant, setVariant] = useState(null);

  const [deletedSizeIds, setDeletedSizeIds] = useState([]);

  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    async function fetchVariant() {
      try {
        const { data } = await api.get(
          `/api/v1/admin/products/${productId}/${variantId}`
        );

        if (data.success) {
          setVariant(data.data);
        }
      } catch (err) {
        console.error("Fetch variant error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (productId && variantId) fetchVariant();
  }, [productId, variantId]);


  const updateSize = (index, field, value) => {
    const updated = [...variant.sizes];
    updated[index][field] = value;
    setVariant({ ...variant, sizes: updated });
  };

  const addSize = () => {
    setVariant({
      ...variant,
      sizes: [
        ...variant.sizes,
        { size: "", stock: 0, sku: "", isActive: true },
      ],
    });
  };

  const removeSize = (index) => {
    const sizeToRemove = variant.sizes[index];

    if (sizeToRemove?._id) {
      setDeletedSizeIds((prev) => [...prev, sizeToRemove._id]);
    }

    setVariant({
      ...variant,
      sizes: variant.sizes.filter((_, i) => i !== index),
    });
  };

  const saveVariant = async () => {
    setSaving(true);
    try {
      const dataToUpdate = {
        ...variant,
        deletedSizeIds
      }

      if(newImages.length > 0){
        dataToUpdate.newImages = newImages;
      }

      const { data } = await api.patch(
        `/api/v1/admin/products/${productId}/${variantId}`, dataToUpdate   
      );

      if (data.success) {
        toast.success("Variant updated successfully");
        router.back();
      }
    } catch (err) {
     toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (image) => {
    setNewImages((prev) => ([...prev, image]));
  }

  /* ================= UI ================= */
  if (loading) return <Skeleton className="h-40 w-full" />;

  if (!variant) {
    return (
      <p className="text-muted-foreground text-center">Variant not found</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-slate-50 font-semibold">Edit Variant</h1>

        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      {variant.images && <ImageCarousel images={variant.images} />}

      <ImageUploader onUploadSuccess={handleImageUpload} />

      {/* Variant Info */}
      <Card className="bg-admin-foreground text-white">
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label className="mb-2">Color</Label>
            <Input
              value={variant.color}
              onChange={(e) =>
                setVariant({ ...variant, color: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={variant.isActive}
              onCheckedChange={(v) => setVariant({ ...variant, isActive: v })}
            />
            <Label>Variant Active</Label>
          </div>
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card className="bg-admin-foreground text-slate-50">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Sizes</h2>
            <Button className="text-black" variant="outline" onClick={addSize}>
              + Add Size
            </Button>
          </div>

          {variant.sizes.map((s, index) => (
            <div
              key={s._id || index}
              className="grid grid-cols-5 gap-3 border p-3 rounded-md"
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
                  onChange={(e) => updateSize(index, "sku", e.target.value)}
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

      <Button onClick={saveVariant} disabled={saving} className="w-full">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
