"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function SectionIntro({ title, subtitle }) {
  const ref = useRef(null);

useGSAP(() => {
  const anim = gsap.from(ref.current.querySelector("h2, p"), {
    y: 28,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    delay: 0.20,
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
    <div ref={ref} className="text-center space-y-4 my-16">
      <h2 className="text-3xl md:text-4xl font-heading">{title}</h2>
      <p className="opacity-70 max-w-xl mx-auto">{subtitle}</p>
    </div>
  );
}
