"use client"

import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { useRouter } from "next/navigation";

gsap.registerPlugin(useGSAP);

export default function HeroBanner(){
  const container = useRef(null);
  const router = useRouter();

  useGSAP(
    () => {
      gsap.from(".animate-hero-content", {
        opacity: 0,
        duration: 2,
        y: 30,
        delay: 1,
        stagger: 0.3,
      });
    },
    { scope: container }
  );

    return (
        <div ref={container} className="relative w-full h-[80vh] overflow-hidden">
                      {/* Background Image */}
                      <Image
                        src="/banner7.jpg"
                        alt="Hero Banner"
                        fill
                        quality={100}
                        sizes="100vw"
                        priority
                        className="object-cover"
                      />
        
                      {/* Dark Gradient Overlay for Readability */}
                      <div className="absolute inset-0 bg-black/30" />
        
                      {/* Centered Content */}
                      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                        <div className="max-w-3xl">
                          {/* Headline */}
                          <h1 className="animate-hero-content text-white font-heading text-4xl md:text-5xl lg:text-6xl leading-tight">
                            Soft. Sophisticated. Timeless.
                          </h1>
        
                          {/* Sub Headline */}
                          <p className="animate-hero-content font-body mt-4 text-white/90 text-sm md:text-base lg:text-lg tracking-wide">
                            Jewellery that feels as beautiful as it looks.
                          </p>
        
                          {/* CTA Button */}
                          <button onClick={() => router.replace("/products")} className="animate-button mt-8 inline-block rounded-full border border-white/70 px-8 py-3 text-sm uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black cursor-pointer">
                            Discover More
                          </button>
                        </div>
                      </div>
                    </div>
    )
}