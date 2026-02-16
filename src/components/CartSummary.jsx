"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
import { ArrowLeft, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/app/lib/api";
import { estimateShipping, setShippingCharge } from "@/app/lib/store/features/cart/cartSlice";

export default function CartSummary() {
  const { subtotal, discount, total } = useAppSelector((state) => state.cart);

  const [pincode, setPincode] = useState("");
  const [checking, setChecking] = useState(false);
  const [estimate, setEstimate] = useState(null);

  let shippingCharge = estimate ? estimate.shipping_charge : 70;

  let orderTotal = total + shippingCharge;
  const isFreeDelivery = orderTotal > 899;

  if(isFreeDelivery){
    orderTotal = orderTotal - shippingCharge;
  }

  const dispatch = useAppDispatch();

  const checkPincode = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Enter a valid 6-digit pincode");
      return;
    }

    setChecking(true);
    setEstimate(null);

    try {
      const result = await dispatch(estimateShipping({pincode, total: orderTotal})).unwrap();
      setEstimate(result);
      dispatch(setShippingCharge(result.shipping_charge));
      toast.success("Delivery available for this pincode");
    } catch (err) {
      setEstimate(null);
      toast.error("Delivery not available for this pincode");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="sticky top-20 rounded-xl border p-4 bg-white space-y-4">
      <h3 className="text-sm font-medium">Order Summary</h3>

      <div className="flex justify-between text-sm items-center">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600 items-center">
          <span>Discount</span>
          <span>-₹{discount}</span>
        </div>
      )}

      <div className="flex justify-between text-sm items-center">
        <span>Shipping</span>
        <span>₹{estimate ? estimate.shipping_charge : 70}</span>
      </div>

      {isFreeDelivery && (
        <div className="flex justify-between text-sm items-center text-green-600">
          <span>Free delivery</span>
          <span>-₹{estimate ? estimate.shipping_charge : 70}</span>
        </div>
      )}

      <hr />

      <div className="flex justify-between font-medium">
        <span>Order Total</span>
        <span>₹{orderTotal}</span>
      </div>

      {/* 📍 PINCODE CHECK */}
      <div className="pt-3 space-y-2">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Truck size={14} />
          Check Your Pincode
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-accent outline-none"
          />

          <Button
            onClick={checkPincode}
            disabled={checking}
            className="px-4 border-0 bg-accent text-white hover:bg-accent-muted"
          >
            {checking ? "..." : "Check"}
          </Button>
        </div>

        {estimate && (
          <p className="text-xs text-green-600">
            Delivery in {estimate.delivery_time}
          </p>
        )}
      </div>

      <Link href="/checkout">
        <Button className="w-full border-0 bg-accent text-white hover:bg-accent-muted">
          Proceed to Checkout
        </Button>
      </Link>

      <Link
        href="/products"
        className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-accent transition"
      >
        <ArrowLeft size={14} />
        Continue shopping
      </Link>
    </div>
  );
}
