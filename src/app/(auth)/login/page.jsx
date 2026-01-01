"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/app/lib/api";

export default function LoginPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      identifier: "",
      otp: "",
    },
  });

  const identifier = watch("identifier");


  const [timer, setTimer] = useState(0);

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
      const response = await api.post("/api/v1/auth/login", { identifier });
      const data = response.data;
      if (data.success) {
        setOtpSent(true);
        setTimer(30);
      }
      
    } catch (error) {
      setErrors("Error in sending OTP");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async ({ identifier, otp }) => {
    try {
      setLoading(true);
      const response = await api.post("/api/v1/auth/verify-otp", {
        identifier,
        otp,
      });

      const data = response.data;
      if(data.success){
        router.replace("/admin");
      }
    } catch (error) {
      setErrors(error);
      throw error;
    } finally {
      setLoading(false);
    }

  };

  const onResendOtp = async () => {
    try {
      if (timer > 0) return;
      await onSendOtp({ identifier });
      setTimer(30);
    } catch (error) {
      setErrors("Error in resending OTP");
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0d]">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        <h1 className="mb-1 text-center text-2xl font-semibold text-white">
          Login
        </h1>

        <p className="mb-6 text-center text-sm text-gray-400">
          {!otpSent
            ? "Get access to your Orders, Wishlist and Recommendations"
            : `Please enter the OTP sent to ${identifier}`}
        </p>

        {/* ================= LOGIN STEP ================= */}
        {!otpSent && (
          <form onSubmit={handleSubmit(onSendOtp)} className="space-y-4">
            <Input
              placeholder="Mobile number / Email"
              {...register("identifier", {
                required: "Mobile or Email is required",
                minLength: {
                  value: 5,
                  message: "Invalid input",
                },
              })}
              className="h-11 bg-[#0b0b0d] border border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
            />

            {errors.identifier && (
              <p className="text-xs text-red-500">
                {errors.identifier.message}
              </p>
            )}

            <Button
              type="submit"
              className="h-11 w-full bg-indigo-600 hover:bg-indigo-500"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Request OTP"}
            </Button>
          </form>
        )}

        {/* ================= OTP STEP ================= */}
        {otpSent && (
          <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-4">
            <Input
              placeholder="Enter 6-digit OTP"
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "OTP must be 6 digits",
                },
              })}
              className="h-11 text-center tracking-widest bg-[#0b0b0d] border border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
            />

            {errors.otp && (
              <p className="text-xs text-red-500">{errors.otp.message}</p>
            )}

            <Button
              type="submit"
              className="h-11 w-full bg-indigo-600 hover:bg-indigo-500"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>

            <div className="flex justify-between text-xs text-gray-500">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="hover:text-white transition"
              >
                Change number
              </button>

              <button
                type="button"
                onClick={onResendOtp}
                disabled={loading || timer > 0}
                className={`transition ${
                  timer > 0
                    ? "text-gray-500 cursor-not-allowed"
                    : "hover:text-white"
                }`}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
