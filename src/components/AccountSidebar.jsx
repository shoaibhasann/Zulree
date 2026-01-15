"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Settings,
  ChevronRight,
  X,
} from "lucide-react";
import gsap from "gsap";

const accountLinks = [
  { label: "My Profile", href: "/myzulree/profile", icon: User },
  { label: "My Orders", href: "/myzulree/orders", icon: Package },
  { label: "Wishlist", href: "/myzulree/wishlist", icon: Heart },
  { label: "Saved Addresses", href: "/myzulree/addresses", icon: MapPin },
  { label: "Account Settings", href: "/myzulree/settings", icon: Settings },
];

export default function AccountSidebar({ open, onClose }) {
  const sidebarRef = useRef(null);
  const linksRef = useRef([]);
  const tlRef = useRef(null);

  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const shouldRender = open || isAnimatingOut;

  useEffect(() => {
    if (!shouldRender) return;

    const tl = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        setIsAnimatingOut(false);
        onClose(); // notify parent AFTER animation
      },
    });

    tl.fromTo(
      sidebarRef.current,
      { x: "100%" },
      { x: "0%", duration: 0.45, ease: "power3.out" }
    ).fromTo(
      linksRef.current,
      { x: 20, opacity: 0 },
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
      {/* OVERLAY */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      />

      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className="fixed top-0 right-0 z-60 h-full w-[300px] bg-white border-l border-border flex flex-col"
      >
        {/* HEADER */}
        <div className="relative px-6 py-5 border-b border-border">
          <h3 className="text-lg font-heading">My Account</h3>
          <p className="text-xs opacity-60">Manage your orders & profile</p>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 cursor-pointer rounded-full hover:bg-black/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* LINKS */}
        <nav className="flex-1 px-6 py-6 space-y-5">
          {accountLinks.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                ref={(el) => (linksRef.current[i] = el)}
                className="group flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3 ">
                  <Icon className="h-4 w-4" />
                  <span className="relative">
                    {item.label}
                    <span className="absolute left-0 -bottom-1 h-[1.5px] w-0 bg-black group-hover:w-full transition-all" />
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-6 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 border rounded-xl py-2 text-sm hover:bg-black hover:text-white transition">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
