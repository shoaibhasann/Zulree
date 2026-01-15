"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter } from "lucide-react";
import AnchorLink from "./AnimatedLink";

export default function Footer() {
  return (
    <footer className="relative mt-20 text-white overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <Image
          src="/footer.jpg" // 👈 apni model image yaha daalo
          alt="Zulree luxury jewellery"
          fill
          className="object-cover object-center"
          priority
        />
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 items-start">
          <div>
              <Image
                src="/zulree-footer.png"
                alt="ZULREE"
                width={200}
                height={20}
                className="block md:hidden w-[140px] md:w-[100px] object-contain"
              />

            <p className="text-sm text-white/70 leading-relaxed mb-5">
              Zulree is a modern jewellery brand celebrating minimal design,
              refined details, and everyday elegance for the new generation.
            </p>

            <div className="flex gap-4">
              <Link
                href="#"
                className="text-white/70 hover:text-white transition"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-white/70 hover:text-white transition"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-white/70 hover:text-white transition"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* QUICK LINKS */}
          {/* QUICK LINKS */}
          <div>
            <h3 className="text-sm font-medium tracking-wide mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <AnchorLink
                  href="/shop"
                  label="Shop"
                  underlineClass="bg-white"
                  className="text-white/70 hover:text-white"
                />
              </li>

              <li>
                <AnchorLink
                  href="/collections"
                  label="Collections"
                  underlineClass="bg-white"
                  className="text-white/70 hover:text-white"
                />
              </li>

              <li>
                <AnchorLink
                  href="/about"
                  label="About Us"
                  underlineClass="bg-white"
                  className="text-white/70 hover:text-white"
                />
              </li>

              <li>
                <AnchorLink
                  href="/contact"
                  label="Contact"
                  underlineClass="bg-white"
                  className="text-white/70 hover:text-white"
                />
              </li>
            </ul>
          </div>

          {/* STORE POLICY */}
          {/* STORE POLICY */}
          <div>
            <h3 className="text-sm font-medium tracking-wide mb-4">
              Store Policy
            </h3>

            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <AnchorLink
                  href="/shipping-policy"
                  label="Shipping Policy"
                  underlineClass="bg-white/80"
                  className="text-white/70 hover:text-white"
                />
              </li>

              <li>
                <AnchorLink
                  href="/return-policy"
                  label="Return & Exchange"
                  underlineClass="bg-white/80"
                  className="text-white/70 hover:text-white"
                />
              </li>

              <li>
                <AnchorLink
                  href="/privacy-policy"
                  label="Privacy Policy"
                  underlineClass="bg-white/80"
                  className="text-white/70 hover:text-white"
                />
              </li>

              <li>
                <AnchorLink
                  href="/terms"
                  label="Terms & Conditions"
                  underlineClass="bg-white/80"
                  className="text-white/70 hover:text-white"
                />
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-sm font-medium tracking-wide mb-4">
              Join Our Newsletter
            </h3>
            <p className="text-sm text-white/70 mb-4">
              New launches, exclusive edits, and private offers.
            </p>

            <form className="flex items-stretch border border-white/30 rounded-md overflow-hidden">
              <input
                type="email"
                placeholder="Your email address"
                className="
      flex-1
      min-w-0
      bg-transparent
      px-4
      py-2.5
      text-sm
      outline-none
      placeholder:text-white/40
      rounded-l-md
    "
              />

              <button
                type="submit"
                className="
      shrink-0
      bg-white
      text-black
      px-6
      py-2.5
      text-sm
      font-medium
      hover:bg-white/90
      transition
      rounded-r-md
      cursor-pointer
    "
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SEPARATOR */}
      <div className="relative z-10 border-t border-white/15" />

      {/* COPYRIGHT */}
      <div className="relative z-10 text-center text-sm text-white/60 py-6">
        © {new Date().getFullYear()} Zulree. All rights reserved.
      </div>
    </footer>
  );
}
