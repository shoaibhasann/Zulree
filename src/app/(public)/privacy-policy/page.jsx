"use client";

import Image from "next/image";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fff5f7] px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 md:p-10 space-y-6">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">Your privacy matters to us 🤍</p>
          <p className="text-xs text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* ILLUSTRATION */}
        <div className="flex justify-center border-b">
          <Image
            src="/privacy-policy.svg"
            alt="Privacy Policy Illustration"
            width={300}
            height={300}
            priority
          />
        </div>

        {/* CONTENT */}
        <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            At <span className="font-medium text-gray-900">Zulree</span>, your
            trust is important to us. This Privacy Policy explains how we
            collect, use, and protect your personal information when you shop
            with us.
          </p>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">
              🔐 Information We Collect
            </h2>
            <p>
              We may collect personal details such as your name, phone number,
              email address, shipping address, and payment information to
              process your orders smoothly.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">
              🛍 How We Use Your Information
            </h2>
            <p>
              Your information is used to fulfill orders, provide order updates,
              improve our services, and offer a better shopping experience.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">🤝 Data Sharing</h2>
            <p>
              We only share your data with trusted partners such as payment
              gateways and delivery partners, strictly for order processing and
              delivery purposes.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">🔒 Data Security</h2>
            <p>
              We use industry-standard security measures to protect your
              personal information from unauthorized access or misuse.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">🍪 Cookies</h2>
            <p>
              Cookies help us personalize your experience and analyze site
              traffic. You can manage cookie preferences through your browser
              settings.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-900">📞 Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or your data,
              please contact our support team. We’re always here to help.
            </p>
          </div>
        </section>

        <hr />

        <p className="text-xs text-gray-600 text-center">
          We respect your privacy and value your trust 💕
        </p>
      </div>
    </div>
  );
}
