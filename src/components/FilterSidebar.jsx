"use client";

import { X } from "lucide-react";
import clsx from "clsx";
import ProductFilters from "./ProductFilters";

export default function FilterSidebar({ open, onClose }) {
  return (
    <>
      {/* OVERLAY (MOBILE ONLY) */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={clsx(
          "fixed md:sticky top-0 md:top-24 left-0 z-50 md:z-30",
          "h-full md:h-auto w-[280px]",
          "bg-white p-6 overflow-y-auto no-scrollbar",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* MOBILE HEADER */}
        <div className="flex items-center justify-end mb-6 pt md:hidden">
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <ProductFilters />
      </div>
    </>
  );
}
