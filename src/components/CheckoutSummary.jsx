"use client";

import { useAppSelector } from "@/app/lib/store/hooks";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CheckoutSummary({ address, items, onPaySecurely
 }) {
  const { subtotal, discount, total, shipping } = useAppSelector(
    (state) => state.cart,
  );

  return (
    <div className="sticky top-24 rounded-2xl border bg-white p-5 space-y-4">
      <h3 className="text-sm font-medium">Order Summary</h3>

      {/* ITEMS */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.sku} className="flex gap-3 text-sm">
            <Image
              src={item.image.secure_url}
              alt={item.title}
              width={48}
              height={48}
              className="rounded-lg"
            />

            <div className="flex-1">
              <p className="line-clamp-1">{item.title}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>

            <span>₹{item.priceAt}</span>
          </div>
        ))}
      </div>

      <hr />

      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>-₹{discount}</span>
        </div>
      )}

      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
      </div>

      <hr />

      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      {/* PAY */}
      <Button
        className="w-full border-0 bg-accent text-white hover:bg-accent-muted rounded-xl"
        disabled={!address}
        onClick={() => onPaySecurely()}
      >
        Pay Securely
      </Button>

      {!address && (
        <p className="text-xs text-red-500 text-center">
          Please select a delivery address
        </p>
      )}

      <p className="text-[11px] text-gray-400 text-center">
        Secure payments • Encrypted checkout
      </p>
    </div>
  );
}
