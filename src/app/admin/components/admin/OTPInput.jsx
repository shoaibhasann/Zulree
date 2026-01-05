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
    <div className="flex justify-around p-0 max-w-sm">
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
            w-11 h-11
            text-center text-lg font-medium
            bg-[#0b0b0d]
            border border-white/20
            rounded-md
            text-white
            caret-white
            focus:outline-none
            focus:border-indigo-500
            focus:ring-1 focus:ring-indigo-500
          "
        />
      ))}
    </div>
  );
}
