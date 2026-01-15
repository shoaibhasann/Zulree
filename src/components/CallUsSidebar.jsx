"use client";

import {
  X,
  PhoneIcon,
  Mail,
  MessageCircle,
  Facebook,
  HelpCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* 📞 CONTACT OPTIONS */
const items = [
  {
    icon: PhoneIcon,
    label: "+91 7818906577",
    href: "tel:+917818906577",
  },
  {
    icon: Mail,
    label: "support@zulree.com",
    href: "mailto:support@zulree.com",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Support",
    href: "https://wa.me/917818906577",
  },
  {
    icon: Facebook,
    label: "Facebook Messenger",
    href: "#",
  },
];

export default function CallUsSidebar({ open, onClose }) {
  const sidebarRef = useRef(null);
  const itemsRef = useRef([]);
  const tlRef = useRef(null);

  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const shouldRender = open || isAnimatingOut;

  useEffect(() => {
    if (!shouldRender) return;

    const tl = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        setIsAnimatingOut(false);
        onClose();
      },
    });

    /* SIDEBAR SLIDE */
    tl.fromTo(
      sidebarRef.current,
      { x: "100%" },
      { x: "0%", duration: 0.45, ease: "power3.out" }
    );

    /* ITEMS STAGGER */
    tl.fromTo(
      itemsRef.current,
      { x: 30, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.35,
        stagger: 0.08,
        ease: "power2.out",
      },
      "-=0.25"
    );

    tlRef.current = tl;
    open ? tl.play() : tl.reverse();

    return () => tl.kill();
  }, [open, shouldRender, onClose]);

  function handleClose() {
    setIsAnimatingOut(true);
    tlRef.current?.reverse();
  }

  if (!shouldRender) return null;

  return (
    <>
      {/* 🌫 OVERLAY */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      />

      {/* 📞 SIDEBAR */}
      <aside
        ref={sidebarRef}
        className="fixed top-0 right-0 z-60 h-full w-full max-w-md bg-white border-l border-border flex flex-col"
      >
        {/* HEADER */}
        <div className="relative px-6 py-5 border-b border-border">
          <h2 className="text-lg font-heading">Call Us</h2>
          <p className="text-xs opacity-60">
            Our advisors are here to help you
          </p>

          {/* ❌ CLOSE */}
          <button
            onClick={handleClose}
            className="absolute cursor-pointer top-4 right-4 p-1 rounded-full hover:bg-black/5 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 px-6 py-8 space-y-8">
          <p className="text-sm opacity-80 leading-relaxed">
            Wherever you are, Zulree Client Advisors will be delighted to assist
            you.
          </p>

          {/* CONTACT OPTIONS */}
          <div className="space-y-5">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  ref={(el) => (itemsRef.current[i] = el)}
                  className="group flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="h-5 w-5 text-text-primary" />
                    <span className="relative">
                      {item.label}
                      {/* underline */}
                      <span className="absolute left-0 -bottom-1 h-[1.5px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* HELP */}
          <div className="pt-6 border-t">
            <div className="flex items-center gap-3 cursor-pointer group">
              <HelpCircle className="h-5 w-5 opacity-70" />
              <span className="text-sm font-medium group-hover:underline">
                Need Help?
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
