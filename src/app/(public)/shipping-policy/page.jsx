"use client";

import Image from "next/image";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fff5f7] px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 md:p-10 space-y-6">
        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-2xl text-center md:text-3xl font-semibold text-gray-900">
            Shipping Policy
          </h1>
          <p className="text-sm text-center text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* ILLUSTRATION */}
        <div className="flex justify-center">
          <Image
            src="/shipping-policy.svg"
            alt="Shipping Policy Illustration"
            width={300}
            height={300}
            priority
          />
        </div>


        {/* CONTENT */}
        <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            At <span className="font-medium text-gray-900">Zulree</span>, we aim
            to deliver your orders in a timely and secure manner. Please review
            our shipping policy below to understand how deliveries are handled.
          </p>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-900">
              🚚 Shipping Coverage
            </h2>
            <p>
              We currently ship across India. Delivery availability may vary
              depending on your location and serviceability of our courier
              partners.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-900">
              ⏱ Order Processing Time
            </h2>
            <p>
              Orders are usually processed within{" "}
              <strong>24–48 business hours</strong>. Once dispatched, you will
              receive tracking details via WhatsApp or Email.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-900">
              📦 Delivery Timeline
            </h2>
            <p>
              Estimated delivery time is typically{" "}
              <strong>3–7 business days</strong>, depending on your location and
              courier service.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-900">
              💰 Shipping Charges
            </h2>
            <p>
              Shipping charges, if applicable, are clearly displayed at checkout
              before you complete your purchase.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-900">
              ❌ Delays & Exceptions
            </h2>
            <p>
              While we strive for timely delivery, delays may occur due to
              factors beyond our control such as weather conditions, logistics
              issues, or regional restrictions.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-900">
              📞 Support
            </h2>
            <p>
              If you have any questions regarding shipping or delivery, please
              reach out to our support team. We’re always happy to help.
            </p>
          </div>
        </section>

        <hr />

        {/* FOOTER NOTE */}
        <p className="text-xs text-gray-600 text-center">
          Thank you for choosing Zulree. We appreciate your trust ❤️
        </p>
      </div>
    </div>
  );
}
