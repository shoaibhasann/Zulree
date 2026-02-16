"use client";

import { useState } from "react";
import { getConsent, setConsent } from "@/lib/cookies/consentManager";
import { Button } from "@/components/ui/button";

export default function CookieSettings({ open, onClose }) {
  if (!open) return null;

  const saved = getConsent();

  const [prefs, setPrefs] = useState({
    experience: saved?.experience ?? true,
    analytics: saved?.analytics ?? false,
    marketing: saved?.marketing ?? false,
  });

  const save = () => {
    setConsent(prefs);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-5">
        <h3 className="text-lg font-medium text-gray-900">
          Cookie Preferences
        </h3>

        <Preference
          label="Essential cookies"
          desc="Required for login, cart & checkout"
          checked
          disabled
        />

        <Preference
          label="Experience cookies"
          desc="Remember preferences & smoother UX"
          checked={prefs.experience}
          onChange={() => setPrefs({ ...prefs, experience: !prefs.experience })}
        />

        <Preference
          label="Analytics cookies"
          desc="Help us improve performance"
          checked={prefs.analytics}
          onChange={() => setPrefs({ ...prefs, analytics: !prefs.analytics })}
        />

        <Preference
          label="Marketing cookies"
          desc="Personalized offers & ads"
          checked={prefs.marketing}
          onChange={() => setPrefs({ ...prefs, marketing: !prefs.marketing })}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="text-sm text-gray-500">
            Cancel
          </button>

          <Button className="border-0 bg-accent text-white rounded-xl" onClick={save}>
            Save preferences
          </Button>
        </div>
      </div>
    </div>
  );
}

function Preference({ label, desc, checked, onChange, disabled }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mt-1 accent-pink-500"
      />
    </div>
  );
}
