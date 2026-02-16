"use client";

import { useEffect, useState } from "react";
import { setConsent, hasConsent } from "@/lib/cookies/consentManager";
import { Button } from "@/components/ui/button";

export default function CookieBanner({ onManage }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    setConsent({
      experience: true,
      analytics: true,
      marketing: true,
    });
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50">
      <div className="bg-white border shadow-xl rounded-2xl p-4 space-y-2">
        <p className="text-sm text-gray-700">
          We use cookies to make your shopping experience smoother and more
          personal 💗
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onManage}
            className="text-sm text-gray-500 hover:underline cursor-pointer"
          >
            Manage preferences
          </button>

          <Button
            className="border-0 bg-accent text-white hover:bg-accent-muted rounded-xl"
            onClick={acceptAll}
          >
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
