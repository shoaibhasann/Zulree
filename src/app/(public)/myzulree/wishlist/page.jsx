"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/app/lib/store/hooks";
import { toggleWishlist, toggleWishlistAPI } from "@/app/lib/store/features/wishlist/wishlistSlice";
import { addToCart } from "@/app/lib/store/features/cart/cartSlice";
import WishlistCard from "@/components/WishlistCard";
import ClientData from "@/components/ClientData";
import usePageLoading from "@/hooks/usePageLoading";
import { WishlistCardSkeleton } from "@/components/skeletons/WishlistCardSkeleton";
import { WishlistHeaderSkeleton } from "@/components/skeletons/WishlistHeaderSkeleton";


export default function WishlistPage() {
  const items = useAppSelector((state) => state.wishlist?.items) || [];
  const dispatch = useAppDispatch();
  const loading = usePageLoading(900);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleMoveToBag = (item) => {
    dispatch(
      addToCart({
        productId: item.productId,
        variantId: item.variantId || null,
        sizeId: item.sizeId || null,
        sku: item.sku || item.productId,
        title: item.title,
        slug: item.slug,
        image: item.image,
        priceAt: item.priceAtAdd,
        quantity: 1,
      }),
    );

    const wishlistItem = {
      productId: item.productId,
      variantId: item.variantId || null,
      sizeId: item.sizeId || null,
      notifyOnRestock: item.notifyOnRestock || false,
    };

    dispatch(toggleWishlist(wishlistItem));
    if(isAuthenticated){
      dispatch(toggleWishlistAPI(wishlistItem));
    }
  };

  /* 🔄 LOADING STATE */
  if (loading) {
    return (
      <div className="px-4 md:px-10 py-6">
        <WishlistHeaderSkeleton />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <WishlistCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 py-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-lg font-medium">My Wishlist</h1>
        <ClientData>
          <p className="text-sm opacity-60">
            {items.length} item{items.length !== 1 && "s"} saved
          </p>
        </ClientData>
      </div>

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center mt-24">
          <Image
            src="/emptybag.svg"
            alt="Empty wishlist"
            width={260}
            height={260}
            priority
            className="mb-6 opacity-90"
          />
          <p className="text-sm opacity-60 mb-4">
            You haven’t saved anything yet
          </p>
          <Link href="/products" className="text-sm underline hover:opacity-80">
            Explore products
          </Link>
        </div>
      )}

      {/* WISHLIST GRID */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <WishlistCard
              key={item.productId}
              item={item}
              onMoveToBag={() => handleMoveToBag(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
