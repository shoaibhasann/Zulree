"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductPage() {
  const { productId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    discountPercent: "",
    isActive: true,
  });

  // 🔹 Fetch existing product
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/v1/admin/products/${productId}`);
        const text = await res.text();
        if (!text) throw new Error("Empty response");
        const json = JSON.parse(text);

        if (json.success) {
          const p = json.data;
          setProduct(p);
          setForm({
            title: p.title || "",
            description: p.description || "",
            price: p.price || "",
            stock: p.stock || "",
            discountPercent: p.discountPercent || 0,
            isActive: p.isActive ?? true,
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // 🔹 Submit update
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/v1/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (json.success) {
        router.push(`/admin/products/${productId}`);
      } else {
        alert(json.message || "Update failed");
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  // 🔹 Skeleton
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
    return <p className="text-muted-foreground">Product not found</p>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Description</Label>
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
            <Label>Price (₹)</Label>
            <Input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Stock</Label>
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
          <Label>Discount (%)</Label>
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

          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
