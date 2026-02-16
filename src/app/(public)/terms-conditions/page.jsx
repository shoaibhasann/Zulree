"use client";

import Image from "next/image";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-[#fff5f7] px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 md:p-10 space-y-6">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500">
            Please read carefully before using our services 📜
          </p>
          <p className="text-xs text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* ILLUSTRATION */}
        <div className="flex justify-center">
          <Image
            src="/terms-conditions.svg"
            alt="Terms and Conditions Illustration"
            width={300}
            height={300}
            priority
          />
        </div>

        {/* CONTENT */}
        <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            Welcome to <span className="font-medium text-gray-900">Zulree</span>
            . By accessing or using our website, you agree to comply with and be
            bound by the following terms and conditions.
          </p>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">📜 Use of Website</h2>
            <p>
              You agree to use this website only for lawful purposes and in a
              manner that does not infringe the rights of others or restrict
              their use of the site.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">
              🛍 Product Information
            </h2>
            <p>
              We strive to display product details as accurately as possible.
              However, slight variations in color or design may occur due to
              screen differences or photography.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">
              💳 Pricing & Payments
            </h2>
            <p>
              All prices listed on the website are in Indian Rupees (INR).
              Payments must be completed through our secure payment gateways at
              checkout.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">
              🚚 Shipping & Delivery
            </h2>
            <p>
              Delivery timelines provided are estimates and may vary depending
              on location, courier partner, or unforeseen circumstances.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">
              🔄 Returns & Exchanges
            </h2>
            <p>
              Returns and exchanges are subject to our Return & Exchange Policy.
              Please review the policy before placing an order.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">
              ⚠️ Limitation of Liability
            </h2>
            <p>
              Zulree shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of our products or
              services.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">🔄 Changes to Terms</h2>
            <p>
              We reserve the right to update or modify these terms at any time.
              Changes will be effective immediately upon posting on this page.
            </p>
          </div>
        </section>

        <hr />

        <p className="text-xs text-gray-600 text-center">
          Thank you for trusting Zulree and being part of our journey 💕
        </p>
      </div>
    </div>
  );
}
