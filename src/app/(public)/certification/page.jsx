"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Gem, RefreshCcw, Award } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function CertificationPage() {
  const containerRef = useRef(null);

useEffect(() => {
  const ctx = gsap.context((self) => {
    self.selector(".fade-up").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      });
    });
  }, containerRef);

  return () => ctx.revert();
}, []);



  return (
    <div ref={containerRef} className="bg-[#0b0b0b] text-white">
      {/* HERO */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <span className="uppercase tracking-[0.3em] text-xs text-accent-400 fade-up">
          Zulree Assurance
        </span>
        <h1 className="text-4xl md:text-6xl font-light mt-4 fade-up ">
          Certified. Authentic. Trusted.
        </h1>
        <p className="max-w-2xl mt-6 text-gray-400 text-sm md:text-base fade-up">
          Every Zulree jewellery piece is carefully crafted, thoroughly
          inspected, and delivered with a promise of authenticity, quality, and
          elegance.
        </p>
      </section>

      {/* CERTIFICATION CARDS */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-8">
        <CertificationCard
          icon={<ShieldCheck />}
          title="Authenticity Guaranteed"
          desc="Each piece undergoes strict quality checks to ensure genuine materials and flawless finishing."
        />
        <CertificationCard
          icon={<Gem />}
          title="Premium Materials"
          desc="Crafted using high-grade alloys, premium plating, and skin-safe finishes for long-lasting shine."
        />
        <CertificationCard
          icon={<Award />}
          title="Expert Craftsmanship"
          desc="Designed and finished by skilled artisans with attention to detail in every curve and setting."
        />
        <CertificationCard
          icon={<RefreshCcw />}
          title="Hassle-Free Returns"
          desc="If it doesn’t feel right, return it easily — your trust matters more than a sale."
        />
      </section>

      {/* PROCESS */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light fade-up text-accent">
            Our Certification Process
          </h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <ProcessStep
              step="01"
              title="Material Selection"
              desc="Only premium-grade materials are selected to ensure durability, comfort, and elegance."
            />
            <ProcessStep
              step="02"
              title="Quality Inspection"
              desc="Each jewellery piece is manually inspected for finish, strength, and detailing."
            />
            <ProcessStep
              step="03"
              title="Final Approval"
              desc="Approved pieces are packed securely and dispatched with Zulree’s quality assurance."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function CertificationCard({ icon, title, desc }) {
  return (
    <div className="fade-up cursor-pointer bg-[#111] border border-white/10 p-8 rounded-2xl hover:border-white/20 transition">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-accent-400 border border-white/20 mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-light mb-3">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function ProcessStep({ step, title, desc }) {
  return (
    <div className="fade-up cursor-pointer bg-[#111] border border-white/10 p-8 rounded-2xl hover:border-white/20 transition">
      <span className="text-xs tracking-widest text-gray-500">{step}</span>
      <h4 className="text-xl font-light mt-3 mb-3">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
