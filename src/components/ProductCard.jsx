"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { calculateFinalPrice } from "@/helpers/calculateFinalPrice";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
import { useRouter } from "next/navigation";
import {
  toggleWishlist,
  toggleWishlistAPI,
} from "@/app/lib/store/features/wishlist/wishlistSlice";
import { addToCart } from "@/app/lib/store/features/cart/cartSlice";

export default function ProductCard({ p, className }) {

  const dispatch = useAppDispatch();
  const router = useRouter();

  const isLoggedIn = useAppSelector((state) => state.auth.isAuthenticated);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const cartItems = useAppSelector((state) => state.cart.items);

  const isWishlisted = wishlistItems.some((item) => item.productId === p._id);

  const isInCart = cartItems.some((item) => item.productId === p._id);

  const discount = Number(p.discountPercent || 0);
  const price = Number(p.price) || 0;
  const finalPrice = Number(p.finalPrice) || 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlistItem = {
      productId: p._id,
      variantId: p.variantId || null,
      sizeId: p.sizeId || null,
      sku: p.sku || p._id,
      title: p.title,
      slug: p.slug || p._id,
      discountPercent: discount,
      image: p.images?.[0]
        ? {
            public_id: p.images[0].public_id,
            secure_url: p.images[0].secure_url,
          }
        : null,
      price,
      finalPrice,
      notifyOnRestock: false,
      addedAt: new Date().toISOString(),
    };

    dispatch(toggleWishlist(wishlistItem));

    if (isLoggedIn) {
      dispatch(
        toggleWishlistAPI({
          productId: wishlistItem.productId,
          variantId: wishlistItem.variantId,
          sizeId: wishlistItem.sizeId,
          notifyOnRestock: wishlistItem.notifyOnRestock,
          addedAt: new Date().toISOString(),
        }),
      );
    }
  };

  const handleCartCTA = () => {
    if (isInCart) {
      router.push("/myzulree/cart");
      return;
    }

    dispatch(
      addToCart({
        productId: p._id,
        sku: p.sku || p._id,
        variantId: p.variantId || null,
        sizeId: p.sizeId || null,
        title: p.title,
        slug: p.slug || p._id,
        image: p.images?.[0]
          ? {
              public_id: p.images[0].public_id,
              secure_url: p.images[0].secure_url,
            }
          : null,
        priceAt: p.finalPrice,
        quantity: 1,
      }),
    );
  };

  return (
    <div className={`bg-white mb-5 shrink-0 ${className || ""}`}>
      {/* IMAGE */}
      <Link href={`/products/${p.slug || p._id}`}>
        <div className="relative aspect-3/4 sm:aspect-square overflow-hidden mb-3">
          {/* WISHLIST */}
          <button
            onClick={handleWishlist}
            className="absolute bottom-2 right-2 z-10 p-1.5"
          >
            <Heart
              className={`w-4 h-4 transition ${
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "fill-white text-black"
              }`}
            />
          </button>

          {p.images?.[0]?.secure_url && (
            <Image
              src={p.images[0].secure_url}
              alt={p.title}
              fill
              className="object-cover"
            />
          )}
        </div>
      </Link>

      {/* TITLE + PRICE */}
      <Link href={`/products/${p.slug || p._id}`}>
        <h3 className="text-sm font-light line-clamp-1 mb-1 hover:underline">
          {p.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          {discount > 0 && (
            <p className="text-sm">₹{Math.ceil(p.finalPrice)}</p>
          )}

          <p
            className={`text-sm ${
              discount > 0 ? "line-through opacity-70" : ""
            }`}
          >
            ₹{p.price}
          </p>

          {discount > 0 && (
            <div className="zulree-discount h-5 px-2 text-[11px] font-bold flex items-center">
              <span className="text-white">{discount}% OFF</span>
            </div>
          )}
        </div>
      </Link>

      {/* CART CTA */}
      <Button
        onClick={handleCartCTA}
        className={`w-full border-0 ${
          isInCart
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-accent text-white hover:bg-accent-muted"
        }`}
      >
        {isInCart ? "Go to Cart" : "Add to Bag"}
      </Button>
    </div>
  );
}
