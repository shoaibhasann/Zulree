"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DiscountRibbon from "./DiscountRibbon";

export default function ProductImageGallery({ discount , images = [], title }) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(true);



  const activeImage = images[activeIndex]?.secure_url;

  /* ------------------ IMAGE CHANGE (FADE) ------------------ */
  function changeImage(index) {
    if (index === activeIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsAnimating(false);
    }, 180);
  }

  function nextImage() {
    changeImage((activeIndex + 1) % images.length);
  }

  function prevImage() {
    changeImage(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  }

  /* ------------------ ZOOM (DESKTOP) ------------------ */
  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  }

  /* ------------------ SWIPE (MOBILE) ------------------ */
  function onTouchStart(e) {
    setShowHint(false);
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isSwiping.current = false;
  }

  function onTouchMove(e) {
    if (!touchStartX.current || !touchStartY.current) return;

    const touch = e.touches[0];
    const diffX = touchStartX.current - touch.clientX;
    const diffY = touchStartY.current - touch.clientY;

    // Lock swipe only if horizontal gesture
    if (Math.abs(diffX) > Math.abs(diffY)) {
      isSwiping.current = true;
      e.preventDefault(); // 🔥 stop vertical scroll
    }
  }

  function onTouchEnd(e) {
    if (!isSwiping.current) return;

    const diffX = touchStartX.current - e.changedTouches[0].clientX;

    if (diffX > 60) nextImage();
    else if (diffX < -60) prevImage();

    touchStartX.current = 0;
    touchStartY.current = 0;
    isSwiping.current = false;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="flex flex-col-reverse md:flex-row gap-6">
      {/* THUMBNAILS */}
      <div
        className="
          flex gap-4 w-full
          overflow-x-auto
          md:flex-col md:w-24 md:overflow-visible
        "
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => changeImage(i)}
            className={`
              relative aspect-square min-w-[64px]
              rounded-md overflow-hidden border
              transition-all duration-300
              ${
                i === activeIndex
                  ? "border-black scale-100"
                  : "border-gray-200 opacity-70 hover:opacity-100 hover:scale-[1.02]"
              }
            `}
          >
            <Image
              src={img.secure_url}
              alt={title}
              fill
              unoptimized
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* MAIN IMAGE */}
      <div
        className="relative md:max-h-[80vh] aspect-square overflow-hidden rounded-xl bg-gray-50 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* IMAGE */}
        <div
          className="absolute inset-0"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMouseMove}
        >
          <DiscountRibbon percent={discount} />
          <Image
            key={activeImage} // IMPORTANT for fade
            src={activeImage}
            alt={title}
            fill
            priority
            unoptimized
            className={`
              object-cover transition-all duration-300 ease-out
              ${isAnimating ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"}
            `}
            style={{
              transform:
                zoom && window.innerWidth >= 768 ? `scale(1.8)` : "scale(1)",
              transformOrigin: `${pos.x}% ${pos.y}%`,
            }}
          />
        </div>

        {/* ARROWS (DESKTOP ONLY) */}
        <button
          onClick={prevImage}
          className="
            hidden md:flex
            absolute left-4 top-1/2 -translate-y-1/2
            bg-white/80 backdrop-blur
            p-2 rounded-full shadow
            hover:bg-white transition
          "
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextImage}
          className="
            hidden md:flex
            absolute right-4 top-1/2 -translate-y-1/2
            bg-white/80 backdrop-blur
            p-2 rounded-full shadow
            hover:bg-white transition
          "
        >
          <ChevronRight size={20} />
        </button>

        {/* SWIPE HINT (MOBILE ONLY) */}
        {showHint && (
          <div
            className="
    absolute inset-0 z-10
    flex flex-col items-center justify-center
    bg-black/10 backdrop-blur-[2px]
    md:hidden
    pointer-events-none
    animate-fade
  "
          >
            <div className="flex items-center gap-4 mb-2">
              <ChevronLeft className="animate-swipe-left" size={28} />
              <span className="text-sm font-medium tracking-wide">
                Swipe to view
              </span>
              <ChevronRight className="animate-swipe-right" size={28} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
