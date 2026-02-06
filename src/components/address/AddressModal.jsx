"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/app/lib/api";
import { checkAuth } from "@/app/lib/store/features/auth/authSlice";
import { useAppDispatch } from "@/app/lib/store/hooks";
import toast from "react-hot-toast";
import { MapPin, Loader2 } from "lucide-react";


export default function AddressModal({
  open,
  onClose,
  initialData,
  onSuccess,
}) {
  const { register, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      label: "Other",
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const dispatch = useAppDispatch();
  const isEdit = Boolean(initialData?._id);
  const pincode = watch("pincode");
  const selectedLabel = watch("label");

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  /* ================= GEOLOCATION ================= */

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
          );
          const data = await res.json();

          const pin = data?.address?.postcode;
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            "";
          const state = data?.address?.state || "";

          if (pin) {
            setValue("pincode", pin);
            setValue("city", city);
            setValue("state", state);
          } else {
            toast.error("Unable to detect pincode");
          }
        } catch {
          toast.error("Failed to detect location");
        } finally {
          setLocating(false);
        }
      },
      () => {
        toast.error("Location permission denied");
        setLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  /* ================= PINCODE LOOKUP ================= */

  useEffect(() => {
    if (pincode?.length === 6) {
      fetchPincodeData(pincode);
    }
  }, [pincode]);

  const fetchPincodeData = async (pin) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (data[0]?.Status !== "Success") {
        toast.error("Invalid pincode");
        return;
      }

      const offices = data[0].PostOffice;

      const headOffice = offices.find(
        (o) => o.BranchType === "Head Post Office",
      );

      const cityName = headOffice?.Name || offices[0]?.District || "";

      setValue("city", cityName);
      setValue("state", offices[0].State);
    } catch {
      toast.error("Failed to fetch pincode details");
    }
  };

  /* ================= PREFILL EDIT ================= */

  useEffect(() => {
    if (!open) return;

    if (isEdit) {
      reset({
        label: initialData.label || "Home",
        fullName: initialData.name || "",
        phone: initialData.phone || "",
        addressLine1: initialData.line1 || "",
        addressLine2: initialData.line2 || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
      });
    } else {
      reset();
    }
  }, [open, isEdit, initialData, reset]);

  if (!open) return null;

  /* ================= SUBMIT ================= */

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        label: data.label,
        name: data.fullName,
        phone: data.phone,
        line1: data.addressLine1,
        line2: data.addressLine2,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: "India",
      };

      const res = isEdit
        ? await api.patch(`/api/v1/user/addresses/${initialData._id}`, payload)
        : await api.post("/api/v1/user/addresses", {
            ...payload,
            isDefault: false,
          });

      if (res.data?.success) {
        dispatch(checkAuth());
        onSuccess?.();
        onClose();
        toast.success(isEdit ? "Address updated" : "Address added");
      } else {
        toast.error("Failed to save address");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium">
            {isEdit ? "Edit Address" : "Add New Address"}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto custom-scrollbar flex-1">
          <form className="space-y-4">
            {/* LABEL */}
            <div>
              <p className="text-sm font-medium mb-2">Save address as</p>
              <div className="flex gap-3 flex-wrap">
                {["Home", "Office", "Other"].map((type) => (
                  <label
                    key={type}
                    className={`px-4 py-1.5 rounded-full border cursor-pointer text-sm ${
                      selectedLabel === type
                        ? "bg-accent text-white border-accent"
                        : "border-gray-300 text-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      {...register("label")}
                      className="hidden"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <Input
              placeholder="Full Name"
              {...register("fullName", { required: true })}
            />
            <Input
              placeholder="Phone Number"
              {...register("phone", { required: true })}
            />

            <Input
              placeholder="Address Line 1"
              {...register("addressLine1", { required: true })}
            />
            <Input placeholder="Address Line 2" {...register("addressLine2")} />

            {/* GEOLOCATION BUTTON */}
            <button
              type="button"
              onClick={detectLocation}
              disabled={locating}
              className="flex items-center gap-2 text-xs font-medium text-accent 
             px-3 py-2 rounded-lg border border-accent/30 cursor-pointer
             hover:bg-accent/5 transition disabled:opacity-60"
            >
              {locating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <MapPin className="w-3 h-3" />
              )}

              {locating ? "Detecting location…" : "Use my precise location"}
            </button>

            <Input
              placeholder="Pincode"
              {...register("pincode", { required: true })}
            />
            <Input
              placeholder="City"
              {...register("city", { required: true })}
            />
            <Input
              placeholder="State"
              {...register("state", { required: true })}
            />
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <Button type="button" onClick={onClose} className="bg-white text-black border hover:bg-black hover:text-white">
            Cancel
          </Button>
          <Button className="bg-accent text-white border-0 hover:bg-accent-600" onClick={handleSubmit(onSubmit)} disabled={loading}>
            {loading ? "Saving..." : "Save Address"}
          </Button>
        </div>
      </div>
    </div>
  );
}
