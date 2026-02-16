"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  LogIn,
  ChevronRight,
  Search,
  Grid,
  Sparkles,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import gsap from "gsap";

import CategorySidebar from "./CategorySidebar";
import CallUsSidebar from "./CallUsSidebar";
import SearchOverlay from "./SearchOverlay";
import AccountSidebar from "./AccountSidebar";
import { useAppSelector } from "@/app/lib/store/hooks";
import ClientData from "./ClientData";
import Badge from "./Badge";



const navItems = [
  { label: "Home", href: "/", icon: Home },

  // ACTION ITEM (no href)
  { label: "Shop", icon: ShoppingBag, action: "openCategorySidebar" },
  { label: "Your Cart", href: "/myzulree/cart", icon: ShoppingCart },

  { label: "Collections", href: "/products", icon: Grid },
  { label: "New Arrivals", href: "/new-arrivals", icon: Sparkles },
  { label: "Certified Jewellery", href: "/certification", icon: ShieldCheck },
  { label: "Wishlist", href: "/myzulree/wishlist", icon: Heart },
];


/* 🍔 HAMBURGER ICON */
function Hamburger({ open }) {
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <span
        className={`absolute h-0.5 w-6 bg-black transition-all duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "rotate-45" : "-translate-y-2"
        }`}
      />
      <span
        className={`absolute h-0.5 w-6 bg-black transition-all duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute h-0.5 w-6 bg-black transition-all duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "-rotate-45" : "translate-y-2"
        }`}
      />
    </div>
  );
}




export default function PublicSidebar() {
  const router = useRouter();

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

  const wishlistItemsCount = useAppSelector((state) => state.wishlist?.items.length) || 0;
  const cartItemsCount = useAppSelector((state) => state.cart?.items.length) || 0;

  /* 🎬 GSAP SIDEBAR ANIMATION */
  useLayoutEffect(() => {
    if (!shouldRender || tlRef.current) return;
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

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [shouldRender]);

  /* 🔘 HANDLERS */
  function handleHamburgerClick() {
    if (menuActive) {
      setIsAnimatingOut(true);
      tlRef.current?.reverse();
    } else {
      setMenuActive(true);
      setOpen(true);
    }
  }

  function handleClose() {
    setIsAnimatingOut(true);
    tlRef.current?.reverse();
  }

  return (
    <>
      {/* 🍔 HAMBURGER (ONLY CONTROL) */}
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={handleHamburgerClick}
        className="fixed top-5 left-4 md:left-8 z-70 cursor-pointer bg-transparent border-0 focus:outline-none"
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

          <div className="flex items-center pt-2">
            <Image
              src="/zulree-header.png"
              alt="ZULREE"
              width={200}
              height={60}
              className="w-[140px] h-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-4">
            <span
              onClick={() => setCallOpen(true)}
              className="hidden md:block text-sm cursor-pointer hover:text-accent"
            >
              Call Us
            </span>

            <div
              className="relative cursor-pointer"
              onClick={() => router.replace("/myzulree/wishlist")}
            >
              <Heart className="h-5 w-5" />
              <ClientData>
                <Badge count={wishlistItemsCount} />
              </ClientData>
            </div>

            <div
              className="relative cursor-pointer"
              onClick={() => router.replace("/myzulree/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              <ClientData>
                <Badge count={cartItemsCount} />
              </ClientData>
            </div>

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

      {/* 🖤 SIDEBAR */}
      {shouldRender && (
        <aside
          ref={sidebarRef}
          className="fixed top-0 left-0 z-60 h-full w-[280px] bg-white border-r border-border"
        >
          <nav className="px-6 py-6 mt-14 space-y-6">
            {navItems.map((item, i) => {
              const Icon = item.icon;

              // 👉 SHOP = ACTION (Sidebar open)
              if (item.action === "openCategorySidebar") {
                return (
                  <button
                    key={item.label}
                    ref={(el) => (linksRef.current[i] = el)}
                    onClick={() => setShowCategories(true)}
                    className="nav-link w-full group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 ">
                      <Icon className="h-4 w-4" />
                      <span className="relative">
                        {item.label}
                        <span className="absolute left-0 -bottom-1 h-[1.5px] w-0 bg-black group-hover:w-full transition-all" />
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                );
              }

              // 👉 NORMAL LINKS
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleClose}
                  ref={(el) => (linksRef.current[i] = el)}
                  className="nav-link group flex items-center justify-between"
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

          <div className="absolute bottom-0 left-0 w-full p-5 border-t border-border">
            <Link
              href="/products"
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
        handleSidebarClose={handleClose}
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
