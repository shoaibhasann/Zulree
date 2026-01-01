"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  BASE_MATERIAL_OPTIONS,
  MAIN_CATEGORIES,
  OCCASION_OPTIONS,
} from "@/helpers/productSpecifications";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProductSchema } from "@/schemas/createProductSchema";
import { defaultSubcategoriesByCategory } from "@/helpers/subCategoryOptions";
import Image from "next/image";
import ImageUploader from "../../components/ImageUploader";


export default function CreateProductPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      discountPercent: 0,
      stock: 0,
      hasVariants: false,
      isActive: true,
      images: [],
      coreSpecs: {
        stoneType: "N/A",
        occasion: [],
        baseMaterial: "",
        quality: "",
        isAuthentic: false,
      },
    },
  });

  const selectedOccasions = watch("coreSpecs.occasion") || [];
  const mainCategory = watch("category.main");
  const images = watch("images") || [];


  const subCategories = defaultSubcategoriesByCategory[mainCategory] || [];

  async function onSubmit(values) {
    const res = await fetch("/api/v1/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const json = await res.json();
    if (json.success) {
      router.push("/admin/products");
    } else {
      alert(json.message || "Failed to create product");
    }
  }

  const handleImageUpload = (image) => {
    setValue("images", [...images, image], {
      shouldValidate: true,
    });
  };


  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold">Create Product</h1>

      {/* IMAGES */}
      <section className="space-y-4">
        <h2 className="font-medium">Product Images</h2>

        <ImageUploader onUploadSuccess={handleImageUpload} />

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative border rounded-md overflow-hidden"
              >
                <Image
                  src={img.secure_url}
                  alt="product"
                  className="h-24 w-full object-cover"
                />

                {/* Remove image */}
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "images",
                      images.filter((_, i) => i !== idx),
                      { shouldValidate: true }
                    )
                  }
                  className="absolute top-1 right-1 rounded bg-black/60 px-2 py-0.5 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.images && (
          <p className="text-red-500 text-sm">At least one image is required</p>
        )}
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* BASIC INFO */}
        <section className="space-y-4">
          <h2 className="font-medium">Basic Information</h2>

          <div>
            <Label className="mb-2">Title</Label>
            <Input {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2">Slug</Label>
            <Input {...register("slug")} placeholder="zulree-gold-bracelet" />
            {errors.slug && (
              <p className="text-red-500 text-sm">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2">Description</Label>
            <Textarea {...register("description")} rows={4} />
          </div>
        </section>

        {/* CATEGORY */}
        <section className="space-y-4">
          <h2 className="font-medium">Category</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Main Category</Label>
              <Select
                onValueChange={(v) => {
                  setValue("category.main", v);
                  setValue("category.sub", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {MAIN_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category?.main && (
                <p className="text-red-500 text-sm">
                  {errors.category.main.message}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-2">Sub Category</Label>
              <Select
                disabled={!mainCategory}
                onValueChange={(v) => setValue("category.sub", v)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      mainCategory
                        ? "Select sub-category"
                        : "Select main category first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category?.sub && (
                <p className="text-red-500 text-sm">
                  {errors.category.sub.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="space-y-4">
          <h2 className="font-medium">Pricing & Stock</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="mb-2">Price</Label>
              <Input
                type="number"
                {...register("price", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label className="mb-2">Discount %</Label>
              <Input
                type="number"
                {...register("discountPercent", {
                  valueAsNumber: true,
                })}
              />
            </div>

            <div>
              <Label className="mb-2">Stock</Label>
              <Input
                type="number"
                {...register("stock", { valueAsNumber: true })}
              />
            </div>
          </div>
        </section>

        {/* CORE SPECS */}
        <section className="space-y-4">
          <h2 className="font-medium">Core Specifications</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Stone Type</Label>
              <Input {...register("coreSpecs.stoneType")} />
            </div>

            <div>
              <Label className="mb-2">Base Material</Label>
              <Select
                onValueChange={(v) => setValue("coreSpecs.baseMaterial", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {BASE_MATERIAL_OPTIONS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Occasion multi-select */}
          <div>
            <Label>Occasion</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {OCCASION_OPTIONS.map((o) => (
                <label key={o} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedOccasions.includes(o)}
                    onCheckedChange={(checked) => {
                      const next = checked
                        ? [...selectedOccasions, o]
                        : selectedOccasions.filter((x) => x !== o);
                      setValue("coreSpecs.occasion", next);
                    }}
                  />
                  {o}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              onCheckedChange={(v) =>
                setValue("coreSpecs.isAuthentic", Boolean(v))
              }
            />
            Authentic Product
          </label>
        </section>

        {/* FLAGS */}
        <section className="flex gap-6 text-sm">
          <label className="flex items-center gap-2">
            <Checkbox
              onCheckedChange={(v) => setValue("hasVariants", Boolean(v))}
            />
            Has Variants
          </label>

          <label className="flex items-center gap-2">
            <Checkbox
              defaultChecked
              onCheckedChange={(v) => setValue("isActive", Boolean(v))}
            />
            Active
          </label>
        </section>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>

          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
