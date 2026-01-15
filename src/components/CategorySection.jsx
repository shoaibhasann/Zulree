"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: "Bangles", image: "/bangles.jpg" },
  { name: "Bracelets", image: "/bracelets.jpg" },
  { name: "Necklaces", image: "/necklace.jpg" },
  { name: "Earrings", image: "/earrings.jpg" },
  { name: "Jewellery Sets", image: "/js-cat.jpg" },
  { name: "Anklets", image: "/anklets.jpg" },
  { name: "Bridal Collection", image: "/bridal.jpg" },
  { name: "Korean Jewellery", image: "/korean.jpg" },
];

export default function CategorySection() {
    const ref = useRef(null);

    useGSAP(() => {
      const anim = gsap.from(ref.current.querySelector("h2, p"), {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        },
      });

      ScrollTrigger.refresh();

      return () => anim.kill();
    });

  return (
    <section ref={ref} className="bg-background px-6 py-16 md:px-12">
      {/* Section Heading */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-heading">Shop by Category</h2>
        <p className="mt-3 text-sm text-text-secondary">
          Discover jewellery crafted for every moment
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {categories.map((cat) => (
          <Link href={`/products?category=${cat.name}`} key={cat.name} className="group cursor-pointer text-center">
            {/* Image Card */}
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-card">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Category Name */}
            <p className="mt-4 text-sm font-medium tracking-wide">{cat.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
