"use client";

import { useEffect, useState } from "react";
import ImageCarousel from "./ImageCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StockBadge from "./StockBadge";

/* ---------- STOCK BASED SIZE STYLING ---------- */
const sizeBaseClass =
  "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors duration-200 cursor-pointer";

const getSizeClass = (size) => {
  if (size.isActive === false) {
    return "bg-slate-200 text-red-500 line-through border-slate-300 cursor-not-allowed";
  }

  if (size.stock === 0) {
    return "bg-red-100 text-red-600 border-red-400";
  }

  if (size.stock <= 3) {
    return "bg-yellow-100 text-yellow-700 border-yellow-400";
  }

  return "bg-white text-slate-700 border-slate-300 hover:bg-slate-100";
};

export default function ProductCard({ product }) {
  const firstVariant = product?.variants?.[0];

  const [selectedColor, setSelectedColor] = useState(firstVariant?.color);
  const [sizes, setSizes] = useState(firstVariant?.sizes || []);
  const [images, setImages] = useState(firstVariant ? firstVariant.images : product.images);



  return (
    <Card className="bg-admin-foreground border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-6">
          {/* LEFT: IMAGE */}
          <div className="w-[320px] shrink-0">
            <ImageCarousel images={images} alt={product.title} />
          </div>

          {/* RIGHT: DETAILS */}
          <div className="flex flex-col flex-1 text-slate-100">
            {/* PRODUCT INFO */}
            <div className="space-y-1">
              <h2 className="text-base font-semibold line-clamp-1">
                {product.title}
              </h2>

              {product.sku && (
                <p className="text-xs text-admin-muted">
                  <span className="font-medium">SKU:</span> {product.sku}
                </p>
              )}

              <p className="text-sm text-admin-muted line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* PRICE + STOCK */}
            <div className="flex items-center gap-3 mt-3">
              <span className="text-lg font-bold text-slate-300">
                ₹{product.price}
              </span>

              <StockBadge stock={product.stock} />
            </div>

            {/* COLORS */}
            {product.variants?.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4 items-center">
                <span className="text-sm font-medium">Color:</span>

                {product.variants.map((v) => (
                  <div
                    key={v._id}
                    onClick={() => {
                      setSelectedColor(v.color);
                      setSizes(v.sizes);
                      setImages(v.images);
                    }}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-semibold border
                      cursor-pointer transition-all duration-200
                      ${
                        selectedColor === v.color
                          ? "bg-orange-500 text-black border-orange-500 shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }
                    `}
                  >
                    {v.color}
                  </div>
                ))}
              </div>
            )}

            {/* SIZES */}
            {sizes.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4 items-center">
                <span className="text-sm font-medium">Sizes:</span>

                {sizes.map((s) => (
                  <div
                    key={s._id}
                    className={`${sizeBaseClass} ${getSizeClass(s)}`}
                    title={
                      s.stock === 0
                        ? "Out of stock"
                        : s.stock <= 3
                          ? "Low stock"
                          : "In stock"
                    }
                  >
                    {s.size} · {s.stock}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
