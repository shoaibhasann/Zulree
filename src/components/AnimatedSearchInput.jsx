"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const words = [
  "Bracelets",
  "Necklaces",
  "Earrings",
  "Rings",
  "Korean Jewellery",
  "Bangles",
  "Pendant",
];

export default function AnimatedSearchInput({
  value,
  onChange,
  onFocus,
  onBlur,
}) {
  const [index, setIndex] = useState(0);
  const focused = !!value;

  useEffect(() => {
    if (focused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [focused]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black/50" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className="
          w-full
          border
          border-black/20
          py-3
          pl-10
          text-lg
          outline-none
          focus:border-black
          bg-transparent
          rounded-3xl
        "
      />

      {!focused && !value && (
        <div className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 overflow-hidden h-6">
          <div className="flex gap-1 items-center text-lg text-black/50">
            Search for
            <div key={index} className="animate-slide-up">
              “{words[index]}”
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
