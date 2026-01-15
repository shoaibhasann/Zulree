"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  LogIn,
  ChevronRight,
  Search,
  ShoppingBagIcon,
} from "lucide-react";
import Image from "next/image";
import gsap from "gsap";

import CategorySidebar from "./CategorySidebar";
import CallUsSidebar from "./CallUsSidebar";
import SearchOverlay from "./SearchOverlay";
import AccountSidebar from "./AccountSidebar";

/* 🔹 NAV ITEMS */
const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/myzulree/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account", label: "Account", icon: User },
  { href: "/login", label: "Login", icon: LogIn },
];

function Hamburger({ open }) {
  return (
    <div className="relative w-6 h-6 flex items-center justify-center cursor-pointer">
      <span
        className={`absolute h-[1.8px] w-6 bg-black transition-all duration-300 ${
          open ? "rotate-45" : "-translate-y-2"
        }`}
      />
      <span
        className={`absolute h-[1.8px] w-6 bg-black transition-all duration-300 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute h-[1.8px] w-6 bg-black transition-all duration-300 ${
          open ? "-rotate-45" : "translate-y-2"
        }`}
      />
    </div>
  );
}

export default function PublicSidebar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const shouldRender = open || isAnimatingOut;

  const sidebarRef = useRef(null);
  const linksRef = useRef([]);
  const tlRef = useRef(null);

  /* 🧠 GSAP ANIMATION ENGINE */
  useLayoutEffect(() => {
    if (!shouldRender || tlRef.current) return;

    requestAnimationFrame(() => {
      if (!sidebarRef.current || linksRef.current.length === 0) return;

      const tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          setIsAnimatingOut(false);
          setOpen(false);
          setShowCategories(false);
          setMenuActive(false);
          tlRef.current = null;
        },
      });

      tl.fromTo(
        sidebarRef.current,
        { x: "-100%" },
        { x: "0%", duration: 0.45, ease: "power3.out" }
      ).fromTo(
        linksRef.current,
        { x: -20, opacity: 0 },
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
      tl.play();
    });
  }, [shouldRender]);

  /* 🔘 HANDLERS */
function handleHamburgerClick() {
  if (menuActive) {
    setIsAnimatingOut(true);
    tlRef.current?.reverse();
  } else {
    setMenuActive(true); // 🔥
    setOpen(true);
  }
}


  function handleClose() {
    setIsAnimatingOut(true);
    tlRef.current?.reverse();
  }

  return (
    <>
      {/* 🍔 HAMBURGER */}
      <button
        onClick={handleHamburgerClick}
        className="fixed top-5 left-4 md:left-8 z-70"
      >
        <Hamburger open={menuActive} />
      </button>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="flex h-16 items-center justify-between px-3 md:px-6 pl-14 md:pl-24">
          <div
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Search className="h-5 w-5" />
            <span className="hidden md:block text-sm">Search</span>
          </div>

          <div className="flex items-center pt-3">
            <Image
              src="/zulree-header.png"
              alt="ZULREE"
              width={200}
              height={60}
              className="w-[140px] md:w-[160px] h-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-4">
            <span
              onClick={() => setCallOpen(true)}
              className="hidden md:block text-sm cursor-pointer"
            >
              <ShoppingBagIcon className="h-5 w-5 cursor-pointer" />
            </span>
            <Heart className="h-5 w-5 cursor-pointer" />
            <User
              className="h-5 w-5 cursor-pointer"
              onClick={() => setAccountOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* OVERLAY */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity ${
          shouldRender ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* 🖤 MAIN SIDEBAR */}
      {shouldRender && (
        <aside
          ref={sidebarRef}
          className="fixed top-0 left-0 z-60 h-full w-[280px] bg-white border-r border-border"
        >
          <nav className="px-6 py-6 mt-14 space-y-6">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.label !== "Shop" ? item.href : ""}
                  onClick={() => {
                    item.label === "Shop"
                      ? setShowCategories(true)
                      : handleClose();
                  }}
                  ref={(el) => (linksRef.current[i] = el)}
                  className="group flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
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

          {/* FOOTER */}
          <div className="absolute bottom-0 left-0 w-full p-5 border-t border-border">
            <Link
              href="/shop"
              onClick={handleClose}
              className="block text-center bg-black text-white rounded-xl py-2 text-sm"
            >
              Explore Collection
            </Link>
          </div>
        </aside>
      )}

      {/* OTHER SIDEBARS */}
      <CategorySidebar
        open={open && showCategories}
        onClose={() => setShowCategories(false)}
      />
      <CallUsSidebar open={callOpen} onClose={() => setCallOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AccountSidebar
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
      />
    </>
  );
}
