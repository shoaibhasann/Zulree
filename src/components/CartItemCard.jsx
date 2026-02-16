"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useAppDispatch } from "@/app/lib/store/hooks";
import {
  removeFromCart,
  updateQuantity,
} from "@/app/lib/store/features/cart/cartSlice";

export default function CartItemCard({ item }) {
  const dispatch = useAppDispatch();

  const increaseQty = () => {
    dispatch(
      updateQuantity({
        productId: item.productId,
        variantId: item.variantId,
        sizeId: item.sizeId,
        quantity: item.quantity + 1,
      }),
    );
  };

  const decreaseQty = () => {
    dispatch(
      updateQuantity({
        productId: item.productId,
        variantId: item.variantId,
        sizeId: item.sizeId,
        quantity: item.quantity - 1,
      }),
    );
  };

  return (
    <div className="flex gap-4 not-last:border-b  py-4">
      {/* IMAGE */}
      <Link href={`/products/${item.slug}`}>
        <div className="relative w-24 md:w-32 h-32 shrink-0 overflow-hidden rounded-md">
          <Image
            src={item.image.secure_url}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* DETAILS */}
      <div className="flex-1">
        <div className="flex justify-between gap-3">
          <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>

          <button
            onClick={() => dispatch(removeFromCart(item.sku))}
            className="text-gray-400 hover:text-black cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-sm mt-1 text-gray-600">₹{item.priceAt}</p>

        {/* QUANTITY */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center border rounded-md">
            <button
              onClick={decreaseQty}
              disabled={item.quantity <= 1}
              className="px-3 py-1 disabled:opacity-40"
            >
              <Minus size={14} />
            </button>

            <span className="px-3 text-sm">{item.quantity}</span>

            <button
              onClick={increaseQty}
              disabled={item.quantity >= 10}
              className="px-3 py-1 disabled:opacity-40"
            >
              <Plus size={14} />
            </button>
          </div>

          <p className="ml-auto text-sm font-medium">
            ₹{item.priceAt * item.quantity}
          </p>
        </div>
      </div>
    </div>
  );
}
