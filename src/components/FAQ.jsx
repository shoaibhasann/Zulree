"use client";

import { useState } from "react";
import FAQItem from "./FAQItem";

const faqs = [
  {
    q: "What materials are used in Zulree jewellery?",
    a: "Our jewellery is crafted using high-quality base metals with premium plating and carefully selected stones, designed to offer elegance, durability, and everyday comfort.",
  },
  {
    q: "Is Zulree jewellery suitable for daily wear?",
    a: "Yes. Most of our designs are lightweight and thoughtfully finished, making them ideal for daily wear while maintaining a refined, luxury look.",
  },
  {
    q: "How do I care for my jewellery?",
    a: "We recommend storing jewellery in a dry place, avoiding contact with water, perfumes, and chemicals, and gently wiping with a soft cloth after use.",
  },
  {
    q: "What is your return and exchange policy?",
    a: "We offer a hassle-free return or exchange within 7 days of delivery, provided the product is unused and in its original packaging.",
  },
  {
    q: "Do you offer Cash on Delivery (COD)?",
    a: "Yes, Cash on Delivery is available on selected locations across India. Availability may vary based on your delivery pin code.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders are usually processed within 24–48 hours and delivered within 3–7 business days, depending on your location.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-6 py-16">
      {/* SECTION INTRO */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:hidden font-heading mb-3">FAQ</h2>
        <h2 className="hidden md:block text-4xl font-heading mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-sm md:text-base opacity-70 max-w-xl mx-auto">
          Everything you need to know about our jewellery, orders, and services.
        </p>
      </div>

      {/* FAQ LIST */}
      <div className="divide-y divide-black/10">
        {faqs.map((item, index) => (
          <FAQItem
            key={index}
            question={item.q}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          >
            {item.a}
          </FAQItem>
        ))}
      </div>
    </section>
  );
}
