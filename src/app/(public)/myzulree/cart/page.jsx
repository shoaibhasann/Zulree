"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/app/lib/store/hooks";
import CartItemCard from "@/components/CartItemCard";
import CartSummary from "@/components/CartSummary";
import usePageLoading from "@/hooks/usePageLoading";
import { CartItemSkeleton } from "@/components/skeletons/CartItemSkeleton";
import { CartSummarySkeleton } from "@/components/skeletons/CartSummarySkeleton";

export default function CartPage() {
  const items = useAppSelector((state) => state.cart.items);
  const loading = usePageLoading(1000);

  const addresses = useAppSelector((state) => state.user?.addresses);

  // 🔄 LOADING STATE
  if (loading) {
    return (
      <div className="px-4 md:px-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-lg font-medium mb-4">My Cart</h1>

          {[1, 2].map((i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>

        <CartSummarySkeleton />
      </div>
    );
  }

  // 🛒 EMPTY CART
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center mt-24 text-center">
        <Image src="/emptybag.svg" alt="Empty cart" width={260} height={260} />
        <p className="text-sm opacity-60 mt-4">Your shopping bag is empty</p>
        <Link href="/products" className="text-sm underline mt-2">
          Continue shopping
        </Link>
      </div>
    );
  }

  // ✅ CART READY
  return (
    <div className="px-4 md:px-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 border rounded-xl p-4">
        <h1 className="text-lg font-medium mb-4">My Cart ({items.length})</h1>

        {items.map((item) => (
          <CartItemCard key={item.sku} item={item} />
        ))}
      </div>

      <CartSummary />
    </div>
  );
}
