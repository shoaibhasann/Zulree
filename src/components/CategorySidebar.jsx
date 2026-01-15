"use client";

import Link from "next/link";
import { X } from "lucide-react";

const categories = [
  "Necklaces",
  "Bracelets",
  "Earrings",
  "Rings",
  "Korean Jewellery",
  "Jewellery Sets",
  "Bangles",
  "Anklets",
  "Bridal Collection",
];

export default function CategorySidebar({ open, onClose }) {
  return (
    /* 🌫 OVERLAY */
    <div
      onClick={onClose}
      className={`fixed inset-0 z-100 md:z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* 🧾 SIDEBAR / BOTTOM SHEET */}
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`
    fixed z-60 bg-background border-border

    /* ---------------- MOBILE (default) ---------------- */
    bottom-0 left-0 w-full h-[91vh]
    border-t 
    transform transition-transform duration-500
    ease-[cubic-bezier(0.22,1,0.36,1)]
    ${open ? "translate-y-0" : "translate-y-full"}

    /* ---------------- DESKTOP (md+) ---------------- */
    md:top-0 md:left-[281px]
    md:h-full md:w-[280px]
    md:border-t-0 md:rounded-none md:border-r
    md:transition-transform md:duration-500
    md:translate-y-0
    md:${open ? "md:translate-x-0" : "md:-translate-x-full"}
  `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-6 md:py-4 border-b border-border">
          <p className="text-lg font-medium text-text-primary">
            Shop By Category
          </p>
          <button onClick={onClose} className="p-1">
            <X className="h-6 w-6 cursor-pointer" />
          </button>
        </div>

        {/* LIST */}
        <div className="px-6 py-6 space-y-6 overflow-y-auto">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={onClose}
              className="group relative w-fit block"
            >
              <span className="text-[16px] text-text-primary">{cat}</span>

              {/* ✨ UNDERLINE */}
              <span
                className="
                  absolute left-0 -bottom-1
                  h-[1.5px] bg-text-primary
                  w-0 group-hover:w-full
                  transition-all duration-300 ease-out
                "
              />
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
