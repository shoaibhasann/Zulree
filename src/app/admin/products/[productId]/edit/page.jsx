"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import api from "@/app/lib/api";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ImageWrapper from "@/app/admin/components/admin/ImageWrapper";
import Image from "next/image";
import ImageUploader from "@/app/admin/components/admin/ImageUploader";
import toast from "react-hot-toast";

export default function EditProductPage() {

  const { productId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);


  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    discountPercent: 0,
    isActive: true,
  });

  // 🔹 Fetch existing product (AXIOS)
  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await api.get(`/api/v1/admin/products/${productId}`);

        if (data.success) {
          const p = data.data;
          setProduct(p);
          setImages(p.images);
          setForm({
            title: p.title || "",
            description: p.description || "",
            price: p.price ?? "",
            stock: p.stock ?? "",
            discountPercent: p.discountPercent ?? 0,
            isActive: p.isActive ?? true,
          });
        }
      } catch (err) {
        console.error("Fetch product error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchProduct();
  }, [productId]);

  // 🔹 Handle input change
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

const handleImageUpload = (image) => {
  setNewImages((prev) => [...prev, image]);
};


  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Making changes...");

    try {
      const { data } = await api.patch(`/api/v1/admin/products/${productId}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        discountPercent: Number(form.discountPercent),
        images: images,
        newImages: newImages
      });

      if (data.success) {
        toast.success("Changes updated successfully", { id: toastId });
        router.push(`/admin/products/${productId}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", { id: toastId });
    } finally {
      setSaving(false);
    }
  }


  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-admin-muted">Product not found</p>;
  }

  return (
    <div className="max-w-2xl space-y-6 text-white">
      <h1 className="text-xl font-semibold">Edit Product</h1>

      <div className="flex flex-wrap gap-3">
        {images &&
          images.map((img, index) => (
            <ImageWrapper key={img.public_id} className="w-40 h-40">
              <Image
                key={img.public_id}
                src={img.secure_url}
                alt="Variant image"
                fill
                className="object-cover"
              />
            </ImageWrapper>
          ))}
      </div>

      <ImageUploader onUploadSuccess={handleImageUpload} />

      <div className="flex flex-wrap gap-3">
        {newImages &&
          newImages.map((img, index) => (
            <ImageWrapper key={img.public_id} className="w-40 h-40">
              <Image
                key={img.public_id}
                src={img.secure_url}
                alt="Variant image"
                fill
                className="object-cover"
              />
            </ImageWrapper>
          ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="mb-2">Title</Label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label className="mb-2">Description</Label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2">Price (₹)</Label>
            <Input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label className="mb-2">Stock</Label>
            <Input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label className="mb-2">Discount (%)</Label>
          <Input
            name="discountPercent"
            type="number"
            value={form.discountPercent}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update Product"}
          </Button>

          <Button
            className="text-black"
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
