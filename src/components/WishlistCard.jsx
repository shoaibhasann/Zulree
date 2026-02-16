"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
import { toggleWishlist, toggleWishlistAPI } from "@/app/lib/store/features/wishlist/wishlistSlice";
import ClientData from "./ClientData";

export default function WishlistCard({ item, onMoveToBag }) {
  
  const dispatch = useAppDispatch();
  const discount = Number(item.discountPercent || 0);
  const finalPrice = Math.round(item.price * (1 + discount / 100)) || item.finalPrice;
  const { isAuthenticated } = useAppSelector((state) => state.auth);



  const removeFromWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItem = {
      productId: item.productId,
      variantId: item.variantId || null,
      sizeId: item.sizeId || null,
      notifyOnRestock: item.notifyOnRestock || false
    }

    dispatch(toggleWishlist(wishlistItem));

    if(isAuthenticated){
      dispatch(toggleWishlistAPI(wishlistItem));
    }
  };

  return (
    <ClientData>
      <div className="bg-white mb-5 shrink-0">
        {/* IMAGE */}
        <Link href={`/products/${item.slug}`}>
          <div className="relative aspect-3/4 sm:aspect-square overflow-hidden mb-3">
            {/* REMOVE ICON */}
            <button
              onClick={removeFromWishlist}
              aria-label="Remove from wishlist"
              className="absolute top-2 right-2 z-10 bg-white/90 rounded-full p-1 shadow hover:bg-white transition"
            >
              <X className="w-4 h-4 opacity-70 hover:opacity-100" />
            </button>

            {item.image && (
              <Image
                src={item.image.secure_url}
                alt={item.title || "Product Image"}
                fill
                className="object-cover"
              />
            )}
          </div>
        </Link>

        {/* TITLE + PRICE */}
        <Link href={`/products/${item.slug}`}>
          <h3 className="text-sm font-light line-clamp-1 mb-1 hover:underline">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            {discount > 0 && (
              <p className="text-sm font-medium">₹{item.price}</p>
            )}

            <p
              className={`text-sm ${
                discount > 0 ? "line-through opacity-70" : ""
              }`}
            >
              ₹{finalPrice}
            </p>

            {discount > 0 && (
              <div className="zulree-discount h-5 px-2 text-[11px] font-bold flex items-center">
                <span className="text-white">{discount}% OFF</span>
              </div>
            )}
          </div>
        </Link>

        {/* CTA */}
        <Button
          onClick={() => onMoveToBag?.(item)}
          className="w-full border-0 bg-accent text-white hover:bg-accent-muted"
        >
          Move to Bag
        </Button>
      </div>
    </ClientData>
  );
}
