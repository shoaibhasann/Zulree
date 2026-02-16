"use client";

import api from "@/app/lib/api";
import { checkAuth } from "@/app/lib/store/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
import AddressCard from "@/components/address/AddressCard";
import AddressModal from "@/components/address/AddressModal";
import CheckoutAddressOption from "@/components/checkout/CheckoutAddressOption";
import CheckoutAddressSummary from "@/components/checkout/CheckoutAddressSummary";
import CheckoutSummary from "@/components/CheckoutSummary";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const {items: cartItems, total} = useAppSelector((state) => state.cart);

  const addresses = user?.addresses || [];
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const [confirmedAddress, setConfirmedAddress] = useState(defaultAddress);
  const [tempAddress, setTempAddress] = useState(defaultAddress);
  const [showSelector, setShowSelector] = useState(false);
  const [newAddressModal, setNewAddressModal] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);


  const openEditModal = (address) => {
    setTempAddress(address);
    setNewAddressModal(true);
  };

  const handleNewAddressSuccess = (address) => {
  
  }

const handlePayment = async () => {
  try {
    const { data } = await api.post("/api/v1/payment/create-order", {
      amount: total,
    });

    if (!data.success) {
      alert("Payment init failed");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: "INR",
      name: "Zulree",
      description: "Order Payment",
      order_id: data.order.id,

      handler: async function (response) {
        // 🔐 VERIFY PAYMENT
        await api.post("/api/v1/payment/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          addressId: confirmedAddress._id,
        });

        router.push("/order-success");
      },

      prefill: {
        name: user?.name,
        contact: user?.phone,
      },

      theme: { color: "#ec4899" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    alert("Payment failed");
  }
};



  return (
    <div className="px-4 md:px-10 py-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* LEFT */}
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-lg font-medium">Checkout</h1>

        {/* DELIVERY ADDRESS */}
        <div className="space-y-2">
          {!isAuthenticated && (
            <div className="border rounded-xl p-4 bg-white space-y-2">
              <h2 className="text-sm md:text-lg font-semibold">
                Login to continue checkout
              </h2>

              <p className="text-sm text-muted-foreground">
                Please login to add delivery address.
              </p>

              <button
                onClick={() => router.push(`/login?redirectTo=${pathname}`)}
                className="text-sm text-accent font-medium hover:underline"
              >
                Login
              </button>
            </div>
          )}

          {isAuthenticated && addresses.length === 0 && (
            <div className="border rounded-xl p-4 bg-white space-y-2">
              <h2 className="text-sm md:text-lg font-semibold">
                No delivery address found
              </h2>

              <button
                onClick={() => setNewAddressModal(true)}
                className="text-sm text-accent hover:underline"
              >
                Add new address
              </button>
            </div>
          )}

          <div className="border rounded-xl">
            {isAuthenticated && addresses.length > 0 && (
              <div className="flex justify-between items-center p-4">
                <h2 className="text-sm md:text-lg font-semibold">
                  Delivering to {tempAddress?.name}
                </h2>

                {addresses.length > 1 && (
                  <button
                    onClick={() => {
                      setShowSelector(true);
                    }}
                    className="text-sm text-accent hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>
            )}

            {!showSelector && (
              <CheckoutAddressSummary address={confirmedAddress} />
            )}
          </div>

          {showSelector && (
            <div className="border rounded-xl bg-white p-2 space-y-4">
              <h2 className="font-semibold text-sm md:text-lg mx-2">
                Delivery Addresses ({addresses.length})
              </h2>
              {addresses.map((addr) => (
                <CheckoutAddressOption
                  key={addr._id}
                  address={addr}
                  selected={tempAddress?._id === addr._id}
                  onSelect={() => setTempAddress(addr)}
                  onConfirm={() => {
                    setConfirmedAddress(tempAddress);
                    setShowSelector(false);
                  }}
                  onEdit={(address) => openEditModal(address)}
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setNewAddressModal(true)}
          className="text-sm text-accent hover:underline"
        >
          Add new address
        </button>
      </div>

      <AddressModal
        onSuccess={handleNewAddressSuccess}
        open={newAddressModal}
        onClose={() => setNewAddressModal((v) => !v)}
        initialData={tempAddress}
      />

      {/* RIGHT */}
      <CheckoutSummary onPaySecurely={handlePayment} address={confirmedAddress} items={cartItems} />
    </div>
  );
}
