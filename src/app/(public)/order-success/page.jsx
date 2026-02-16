"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl text-center space-y-4">
        <div className="flex items-center justify-center">
          <Image
            src="/order-success.png"
            width={200}
            height={200}
            alt="Order-Placed-Successfully"
          />
        </div>

        <p className="text-sm text-gray-800">
          Thank you for shopping with{" "}
          <span className="font-semibold text-base">Zulree</span>. Your order has been
          confirmed and is being prepared.🎉
        </p>

        <div className="bg-gray-50 rounded-xl py-2 text-sm text-gray-700">
          You’ll receive order updates on WhatsApp / Email shortly.
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push("/myzulree/orders")} className="bg-white text-black border hover:bg-black hover:text-white">
            View Orders
          </Button>

          <Button
            className="border-0 bg-accent text-white hover:bg-accent-muted"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>
        </div>

        <p className="text-[11px] text-gray-400 pt-2">
          Secure payment • Trusted delivery partners
        </p>
      </div>
    </div>
  );
}
