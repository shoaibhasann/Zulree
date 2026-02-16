"use client";

import Image from "next/image";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fff5f7] px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 md:p-10 space-y-6">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Return & Exchange Policy
          </h1>
          <p className="text-sm text-gray-500">
            Easy, transparent & customer-friendly 💝
          </p>
        </div>

        {/* ILLUSTRATION */}
        <div className="flex justify-center">
          <Image
            src="/return-policy.svg"
            alt="Return and Exchange"
            width={300}
            height={300}
          />
        </div>

        <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            At <span className="font-medium text-gray-900">Zulree</span>, we
            want you to love what you wear. If something doesn’t feel right,
            we’ve made returns and exchanges simple and stress-free.
          </p>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">
              🔄 Return & Exchange Window
            </h2>
            <p>
              You can request a return or exchange within{" "}
              <strong>7 days</strong> of receiving your order.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">👗 Eligible Items</h2>
            <p>
              Items must be unused, unwashed, and returned with original tags
              and packaging intact.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">
              🚫 Non-Returnable Items
            </h2>
            <p>
              Due to hygiene reasons, certain items like accessories or
              innerwear may not be eligible for return or exchange.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">💸 Refund Process</h2>
            <p>
              Once the returned item is inspected, refunds are processed within
              <strong> 5–7 business days</strong> to the original payment
              method.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">📦 Exchange Process</h2>
            <p>
              For exchanges, the replacement item will be shipped after the
              returned product is picked up and verified.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">📞 Need Help?</h2>
            <p>
              Our support team is always here to help. Reach out to us for any
              questions related to returns or exchanges.
            </p>
          </div>
        </section>

        <hr />

        <p className="text-xs text-gray-600 text-center">
          We’re here to make your shopping experience delightful 💕
        </p>
      </div>
    </div>
  );
}
