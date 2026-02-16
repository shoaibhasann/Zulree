"use client";

import { Pencil } from "lucide-react";

export default function CheckoutAddressOption({
  address,
  selected,
  onSelect,
  onConfirm,
  onEdit,
}) {
  return (
    <div
      className={`rounded-xl border p-4 space-y-3 transition cursor-pointer ${
        selected
          ? "border-accent bg-accent/5"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onSelect}
    >
      {/* RADIO + CONTENT */}
      <div className="flex items-start gap-3">
        <input
          type="radio"
          checked={selected}
          onChange={onSelect}
          className="mt-1 accent-accent"
        />

        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium text-gray-800">
            {address.label || "Address"} • {address.line1}, {address.line2},{" "}
            {address.city}, {address.state} {address.pincode}, {address.country}
          </p>

          <p className="text-sm text-gray-700">Phone number: {address.phone}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(address);
          }}
          className="text-xs text-accent cursor-pointer flex items-center gap-1 hover:underline"
        >
          <Pencil size={12} />
          Edit
        </button>
      </div>

      {/* CONFIRM CTA */}
      {selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
          className="w-full rounded-lg cursor-pointer bg-accent text-white py-2 text-sm font-medium hover:bg-accent-muted transition"
        >
          Deliver to this address
        </button>
      )}
    </div>
  );
}
