"use client";

import Image from "next/image";
  import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fff5f7] px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-10 space-y-10">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            We’re here for you
          </h1>
          <p className="text-sm text-gray-600">
            Have a question? Need help? We’d love to hear from you 🤍
          </p>
        </div>

        {/* ILLUSTRATION */}
        <div className="flex justify-center">
          <Image
            src="/contact-support.svg"
            alt="Contact Zulree"
            width={300}
            height={300}
          />
        </div>

<section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
  <ContactCard
    title="Email Us"
    value="support@zulree.com"
    icon={<Mail className="w-5 h-5 text-accent" />}
  />

  <ContactCard
    title="WhatsApp"
    value="+91 78189 06577"
    icon={<MessageCircle className="w-5 h-5 text-accent" />}
  />

  <ContactCard
    title="Call Us"
    value="Mon–Sat • 10am–6pm"
    icon={<Phone className="w-5 h-5 text-accent" />}
  />
</section>


        <p className="text-xs text-gray-500 text-center">
          Our support team usually replies within 24 hours 💬
        </p>
      </div>
    </div>
  );
}

function ContactCard({ title, value, icon }) {
  return (
    <div className="bg-[#fff5f7] rounded-xl p-6 flex flex-col items-center text-center gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      {/* ICON */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm">
        {icon}
      </div>

      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{value}</p>
    </div>
  );
}


