import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";

export default function ProductCard({ p, className }) {
  const [like, setLike] = useState(false);
  

  return (
    <div
    className={`
    bg-white mb-5
    min-w-40 sm:min-w-[190px]
    md:min-w-0
    shrink-0
    ${className || ""}
  `}
    >
      {/* CLICKABLE IMAGE */}
      <Link href={`/products/${p?.slug || p?._id}`}>
        <div className="relative aspect-square overflow-hidden mb-3 cursor-pointer">
          {/* WISHLIST */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setLike((prev) => !prev);
            }}
            className="absolute top-2 right-2 z-10 p-1.5"
          >
            <Heart
              className={`w-4 h-4 ${
                like ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />
          </button>

          {p?.images?.[0]?.secure_url && (
            <Image
              src={p.images[0].secure_url}
              alt={p?.title || "Product image"}
              fill
              className="object-cover"
            />
          )}
        </div>
      </Link>

      {/* CLICKABLE TITLE + PRICE */}
      <Link
        href={`/products/${p?.slug || p?._id}`}
        className="block cursor-pointer"
      >
        <h3 className="text-sm font-light line-clamp-1 mb-1 hover:underline">
          {p?.title}
        </h3>
        <p className="text-sm opacity-70 mb-2">₹{p?.price}</p>
      </Link>

      {/* NON-CLICKABLE BUTTON */}
      <Button className="w-full bg-pink-600 text-white border-0 hover:bg-pink-700">
        Add To Cart
      </Button>
    </div>
  );
}
