"use client";

import LogoLoop from "@/components/LogoLoop";

const promoTexts = [
  {
    node: (
      <>
        <span className="uppercase tracking-widest pointer-events-none">
          🎉 NEW YEAR SALE IS LIVE UP TO 70%
        </span>
        <span className="mx-10 inline-block w-14 h-px bg-white/80 align-middle" />
      </>
    ),
  },
  {
    node: (
      <>
        <span className="uppercase tracking-widest pointer-events-none">
          🔁 EASY RETURNS
        </span>
        <span className="mx-10 inline-block w-14 h-px bg-white/80 align-middle" />
      </>
    ),
  },
  {
    node: (
      <>
        <span className="uppercase tracking-widest pointer-events-none">
          🎁 FREE GIFT ON ORDERS ABOVE ₹799
        </span>
        <span className="mx-10 inline-block w-14 h-px bg-white/80 align-middle" />
      </>
    ),
  },
  {
    node: (
      <>
        <span className="uppercase tracking-widest pointer-events-none">
          ✨ FLAT 10% OFF ON BEST SELLERS
        </span>
        <span className="mx-10 inline-block w-14 h-px bg-white/80 align-middle" />
      </>
    ),
  },
  {
    node: (
      <>
        <span className="uppercase tracking-widest pointer-events-none">
          🚚 FREE SHIPPING ABOVE ₹699
        </span>
        <span className="mx-10 inline-block w-14 h-px bg-white/80 align-middle" />
      </>
    ),
  },
  {
    node: (
      <>
        <span className="uppercase tracking-widest pointer-events-none">
          💳 COD AVAILABLE
        </span>
        <span className="mx-8 inline-block w-14 h-px bg-white/80 align-middle" />
      </>
    ),
  },
];


export default function LoopLine() {
  return (
    <div
      aria-hidden="true"
      inert
      className="
   relative w-full bg-black text-white
    h-7 flex items-center
    overflow-hidden
"
    >
      <LogoLoop
        logos={promoTexts}
        direction="left"
        speed={60}
        logoHeight={12}
        gap={0}
        fadeOut
        fadeOutColor="#000000"
        pauseOnHover={false}
      />
    </div>
  );
}
