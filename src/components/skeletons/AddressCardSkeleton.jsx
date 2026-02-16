"use client";

export default function AddressCardSkeleton() {
  return (
    <div className="relative rounded-2xl border bg-white p-5 space-y-4 animate-pulse">
      {/* Label */}
      <div className="h-4 w-20 bg-gray-200 rounded" />

      {/* Full Name */}
      <div className="space-y-2">
        <div className="h-3 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-40 bg-gray-300 rounded" />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <div className="h-3 w-14 bg-gray-200 rounded" />
        <div className="h-4 w-28 bg-gray-300 rounded" />
      </div>

      {/* Address */}
      <div className="space-y-2">
        <div className="h-3 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-300 rounded" />
        <div className="h-4 w-3/4 bg-gray-300 rounded" />
      </div>

      {/* Buttons */}
      <div className="pt-3 flex gap-3">
        <div className="h-8 w-28 bg-gray-200 rounded-full" />
        <div className="h-8 w-20 bg-gray-200 rounded-full" />
        <div className="h-8 w-20 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}
