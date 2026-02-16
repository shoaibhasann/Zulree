"use client";

import CookieBanner from "@/components/cookies/CookieBanner";
import CookieSettings from "@/components/cookies/CookieSettings";
import Footer from "@/components/Footer";
import PublicSidebar from "@/components/PublicSidebar";
import { getConsent } from "@/lib/cookies/consentManager";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { loadGoogleAnalytics } from "../lib/analytics/google";
import { loadMetaPixel } from "../lib/analytics/meta";

export default function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const consent = getConsent();

    if (consent?.analytics) {
      loadGoogleAnalytics();
    }

    if (consent?.marketing) {
      loadMetaPixel();
    }
  }, []);

  return (
    <>
      <PublicSidebar />

      <main className="min-h-screen">
        {children}
        <CookieBanner onManage={() => setOpen(true)} />
        <CookieSettings open={open} onClose={() => setOpen(false)} />
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,

            style: {
              background: "var(--color-card)",
              color: "var(--color-text-primary)",
              borderRadius: "16px",
              padding: "14px 18px",
              fontSize: "14px",
              fontWeight: 500,
              border: "1px solid var(--color-border)",
              boxShadow: "0 10px 30px rgba(28, 23, 25, 0.10)", // soft floating feel
            },

            success: {
              iconTheme: {
                primary: "var(--color-accent)",
                secondary: "var(--color-card)",
              },
              style: {
                background: "linear-gradient(180deg, var(--color-card), #fff)",
              },
            },

            error: {
              iconTheme: {
                primary: "var(--color-accent-deep)",
                secondary: "var(--color-card)",
              },
              style: {
                background: "linear-gradient(180deg, var(--color-card), #fff)",
              },
            },
          }}
        />
      </main>

      <Footer />
    </>
  );
}
