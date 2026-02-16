"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/app/lib/api";
import OTPInput from "@/app/admin/components/admin/OTPInput";
import { useAppDispatch } from "@/app/lib/store/hooks";
import { syncCart } from "@/app/lib/store/features/cart/cartSlice";

/* ---------------- HELPERS ---------------- */
const isValidIdentifier = (value) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return phoneRegex.test(value) || emailRegex.test(value);
};

const getIdentifierType = (value) => {
  if (/^[6-9]\d{9}$/.test(value)) return "phone";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
  return null;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";


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
  } = useForm({ defaultValues: { identifier: "" } });

  const identifier = watch("identifier");

  /* OTP TIMER */
  useEffect(() => {
    if (timer <= 0) return;
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [timer]);

  /* SEND OTP */
  const onSendOtp = async ({ identifier }) => {
    const type = getIdentifierType(identifier);

    if (!type) {
      setError("Enter a valid email or mobile number");
      return;
    }

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

  /* VERIFY OTP */
  const verifyOtp = async () => {
    if (otp.length !== 6 || loading) return;

    try {
      setLoading(true);

      const res = await api.post("/api/v1/auth/verify-otp", {
        identifier,
        otp,
      });

      if (res.data.success) {
        router.replace(redirectTo);
      } else {
        setError(res.data.message);
        setOtp("");
      }
    } catch {
      setError("Invalid OTP");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6) verifyOtp();
  }, [otp]);

  const onResendOtp = async () => {
    if (timer > 0) return;
    await onSendOtp({ identifier });
    setTimer(30);
  };

  const identifierType = getIdentifierType(identifier);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl md:min-h-[60vh] grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden">
        {/* IMAGE SIDE */}
        <div className="relative hidden md:flex items-center justify-center">
          <Image
            src="/banner5.jpg"
            alt="Luxury Jewellery Model"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative z-10 text-left px-10">
            <h2 className="text-3xl font-light text-white mb-3 leading-snug">
              Crafted for
              <br />
              Modern Elegance
            </h2>
            <p className="text-sm text-white/80 max-w-sm">
              Sign in to discover curated jewellery designed to elevate everyday
              beauty.
            </p>
          </div>
        </div>

        {/* FORM SIDE */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-medium text-gray-900 text-center mb-2">
            Welcome Back
          </h1>

          <p className="text-center text-sm text-gray-500 mb-8">
            {!otpSent
              ? "Login using Email or Mobile Number"
              : identifierType === "phone"
                ? `Enter OTP sent to +91******${identifier.slice(-4)}`
                : `Enter OTP sent to ${identifier}`}
          </p>

          {!otpSent && (
            <form onSubmit={handleSubmit(onSendOtp)} className="space-y-5">
              <Input
                type="text"
                placeholder="Email or Mobile number"
                {...register("identifier", {
                  required: "Email or mobile number is required",
                  validate: (value) => {
                    const phoneRegex = /^[6-9]\d{9}$/;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    return (
                      phoneRegex.test(value) ||
                      emailRegex.test(value) ||
                      "Enter a valid email or mobile number"
                    );
                  },
                })}
                className="h-12 rounded-xl bg-white border border-pink-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-pink-400"
              />

              {errors.identifier && (
                <p className="text-xs text-pink-600">
                  {errors.identifier.message}
                </p>
              )}

              {error && (
                <p className="text-xs text-pink-600 text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl border-0 bg-pink-500 hover:bg-pink-600 text-white font-medium tracking-wide"
              >
                {loading ? "Sending OTP..." : "Request OTP"}
              </Button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => router.replace(redirectTo)}
                  className="text-sm text-gray-500 hover:text-pink-500 underline"
                >
                  Continue shopping without login →
                </button>
              </div>
            </form>
          )}

          {otpSent && (
            <div className="max-w-sm mx-auto w-full space-y-6">
              <OTPInput length={6} value={otp} onChange={setOtp} />

              {error && (
                <p className="text-xs text-pink-600 text-center">{error}</p>
              )}

              <Button
                disabled
                className="w-full
      bg-accent
      text-white
      py-3
      rounded-xl
      font-semibold
      transition-all duration-200
      hover:opacity-90
      shadow-md"
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>

              <div className="flex justify-between text-xs text-gray-500">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="hover:text-accent"
                >
                  Change
                </button>

                <button
                  type="button"
                  onClick={onResendOtp}
                  disabled={timer > 0}
                  className={
                    timer > 0 ? "text-gray-400" : "hover:text-accent"
                  }
                >
                  {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
