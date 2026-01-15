"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";

export default function FAQItem({ question, children, isOpen, onToggle }) {
  const [expandedMobile, setExpandedMobile] = useState(false);

  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full text-left py-6 focus:outline-none cursor-pointer"
    >
      {/* QUESTION */}
      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-medium pr-6">{question}</h3>

        <ChevronRight
          className={clsx(
            "h-4 w-4 transition-transform duration-300",
            isOpen && "rotate-90"
          )}
        />
      </div>

      {/* ANSWER */}
      <div
        className={clsx(
          "grid transition-all duration-300 ease-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-3"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div
            className={clsx(
              "text-sm md:text-base opacity-70 leading-relaxed",
              !expandedMobile && "line-clamp-3 md:line-clamp-none"
            )}
          >
            {children}
          </div>

          {/* READ MORE – MOBILE ONLY */}
          {isOpen && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setExpandedMobile((prev) => !prev);
              }}
              className="md:hidden inline-block mt-2 text-sm text-pink-600 font-medium"
            >
              {expandedMobile ? "Read less" : "Read more"}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
