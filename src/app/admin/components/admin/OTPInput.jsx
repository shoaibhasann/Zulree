"use client";

import { useRef } from "react";

export default function OTPInput({ length = 6, value = "", onChange }) {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;

    const otpArr = value.split("");
    otpArr[index] = val[val.length - 1];
    onChange(otpArr.join(""));

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const otpArr = value.split("");

      if (!otpArr[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }

      otpArr[index] = "";
      onChange(otpArr.join(""));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;

    onChange(pasted);

    const focusIndex = pasted.length === length ? length - 1 : pasted.length;
    inputsRef.current[focusIndex]?.focus();
  };

  return (
  <div className="flex justify-between max-w-sm mx-auto gap-2">
    {Array.from({ length }).map((_, i) => (
      <input
        key={i}
        ref={(el) => (inputsRef.current[i] = el)}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value[i] || ""}
        onChange={(e) => handleChange(e, i)}
        onKeyDown={(e) => handleKeyDown(e, i)}
        onPaste={handlePaste}
        className="
          w-12 h-12
          text-center text-lg font-semibold
          bg-white
          border border-gray-300
          rounded-xl
          text-gray-800
          caret-[#ff3f6c]
          shadow-sm
          transition-all duration-200

          focus:outline-none
          focus:border-[#ff3f6c]
          focus:ring-2 focus:ring-[#ff3f6c]/30
        "
      />
    ))}
  </div>
)};
