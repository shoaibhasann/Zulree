"use client";

import { X } from "lucide-react";

export default function ImageWrapper({ children, onRemove, className = "" }) {
  return (
    <div
      className={`relative group rounded-lg overflow-hidden border ${className}`}
    >
      {/* IMAGE */}
      {children}

      {/* REMOVE BUTTON */}
      <button
        type="button"
        onClick={onRemove}
        className="
          absolute top-2 right-2
          z-10
          bg-black/70 text-white
          rounded-full p-1
          opacity-0 group-hover:opacity-100
          transition
          hover:bg-red-600
        "
        aria-label="Remove image"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
