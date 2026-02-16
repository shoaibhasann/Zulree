"use client";

import useHydrated from "@/hooks/useHydrated";


export default function ClientData({ children, fallback = null }) {
  const hydrated = useHydrated();

  if (!hydrated) return fallback;

  return children;
}
