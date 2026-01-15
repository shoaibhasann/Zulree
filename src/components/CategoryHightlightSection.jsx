"use client";

import ProductGrid from "./ProductGrid";
import Link from "next/link";

export default function CategoryHighlightSection({
  category,
  ctaText = "Explore Collection",
  ctaHref = "/shop",
}) {
  return (
    <section
      className="
        relative
        w-full
      "
    >
      {/* INTRO */}


      {/* CONTENT CONTAINER */}
      <div
        className="
          relative
          mx-auto
          max-w-7xl
          bg-white
          overflow-hidden
        "
      >
        {/* PRODUCTS */}
          <ProductGrid category={category} />

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href={`/products?category=${category}`}
            className="
              my-4
              px-8 py-3
              rounded-full
              bg-black text-white
              text-sm font-medium
              hover:bg-black/90
              transition
            "
          >
            See More Styles
          </Link>
        </div>
      </div>
    </section>
  );
}
