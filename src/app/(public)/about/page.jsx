"use client";

import Image from "next/image";
import { Heart, Gem, BadgeCheck } from "lucide-react";


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fff5f7] px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 md:p-10 space-y-10">
        {/* HERO */}
        <section className="text-center space-y-3">
          <span className="uppercase tracking-[0.3em] text-xs text-accent">
            About Zulree
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Jewellery that feels personal
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Zulree was created with a simple belief — jewellery should feel
            effortless, elegant, and made for everyday confidence.
          </p>
        </section>

        {/* ILLUSTRATION */}
        <div className="flex justify-center">
          <Image
            src="/about-zulree.svg"
            alt="About Zulree"
            width={300}
            height={300}
          />
        </div>

        {/* STORY */}
        <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            At <span className="font-medium text-gray-900">Zulree</span>, we
            design jewellery for modern women who love subtle elegance. Every
            piece is thoughtfully crafted to blend comfort, beauty, and
            durability.
          </p>

          <p>
            From everyday essentials to statement pieces, Zulree jewellery is
            designed to move with you — at work, at celebrations, and everywhere
            in between.
          </p>
        </section>

        {/* VALUES */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <ValueCard
    title="Designed for You"
    desc="Inspired by modern Indian women and their everyday lives."
    icon={<Heart className="w-5 h-5 text-accent" />}
  />

  <ValueCard
    title="Quality First"
    desc="Premium materials, skin-safe finishes, and strict quality checks."
    icon={<Gem className="w-5 h-5 text-accent" />}
  />

  <ValueCard
    title="Honest Pricing"
    desc="Luxury feel without unnecessary markups."
    icon={<BadgeCheck className="w-5 h-5 text-accent" />}
  />
</section>


        <p className="text-xs text-gray-500 text-center">
          Zulree — crafted with care, worn with confidence ✨
        </p>
      </div>
    </div>
  );
}

function ValueCard({ title, desc, icon }) {
  return (
    <div className="bg-[#fff5f7] rounded-xl p-6 text-center flex flex-col items-center gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      {/* ICON */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm">
        {icon}
      </div>

      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}


