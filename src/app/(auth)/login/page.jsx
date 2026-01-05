"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/app/lib/api";
import OTPInput from "@/app/admin/components/admin/OTPInput";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      identifier: "",
    },
  });

  const identifier = watch("identifier");

  
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  
  const onSendOtp = async ({ identifier }) => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/api/v1/auth/login", {
        identifier,
      });

      if (res.data.success) {
        setOtpSent(true);
        setTimer(30);
      }
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  
  const verifyOtp = async () => {
    if (otp.length !== 6 || loading) return;

    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/api/v1/auth/verify-otp", {
        identifier,
        otp,
      });

      if (res.data.success) {
        router.replace("/admin");
      } else {
        setError(res.data.message);
        setOtp("");
      }
    } catch {
      setError(res.data.message);
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp();
    }
  }, [otp]);


  const onResendOtp = async () => {
    if (timer > 0) return;
    await onSendOtp({ identifier });
    setTimer(30);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0d]">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#171717] p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        <h1 className="mb-1 text-center text-2xl font-semibold text-white">
          Login into your account
        </h1>

        <p className="mt-4 mb-6 text-center text-sm text-[#99a09d]">
          {!otpSent
            ? "Get access to your Orders, Wishlist and Recommendations"
            : `Enter the OTP sent to +91XXXXXX${identifier.slice(6, 10)}`}
        </p>

        {/* ================= PHONE STEP ================= */}
        {!otpSent && (
          <form onSubmit={handleSubmit(onSendOtp)} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center gap-2 px-3 border-r border-white/10 bg-[#212121] rounded-l-md">
                <Image
                  src="/flag.svg"
                  alt="India"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span className="text-sm text-gray-300">+91</span>
              </div>

              <Input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter mobile number"
                {...register("identifier", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter valid 10-digit mobile number",
                  },
                })}
                onInput={(e) =>
                  (e.target.value = e.target.value.replace(/\D/g, ""))
                }
                className="h-11 pl-22 bg-[#212121] border-0 text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-indigo-500"
              />
            </div>

            {errors.identifier && (
              <p className="text-xs text-red-500">
                {errors.identifier.message}
              </p>
            )}

            <Button
              type="submit"
              className="h-11 p-0 w-full bg-indigo-600 hover:bg-indigo-700 border-0 text-white"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </Button>
          </form>
        )}

        {/* ================= OTP STEP ================= */}
        {otpSent && (
          <div className="space-y-4 p-0">
            <OTPInput value={otp} onChange={setOtp} />

            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}

            <div className="flex justify-center">
              <Button
                disabled
                className="h-11 w-[97%] text-center bg-indigo-600 text-white opacity-80"
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="hover:text-white cursor-pointer transition"
              >
                Change number
              </button>

              <button
                type="button"
                onClick={onResendOtp}
                disabled={timer > 0}
                className={`transition ${
                  timer > 0
                    ? "text-gray-500 cursor-not-allowed"
                    : "hover:text-white cursor-pointer hover:underline"
                }`}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
