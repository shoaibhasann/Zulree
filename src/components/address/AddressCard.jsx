"use client";

import { CheckCircle, Home, Briefcase, Tag } from "lucide-react";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) {
  const renderLabel = () => {
    if (!address.label) return null;

    if (String(address.label).trim() === "Home") {
      return (
        <div className="flex items-center gap-1 text-xs text-accent font-medium">
          <Home size={14} />
          Home
        </div>
      );
    }

    if (String(address.label).trim() === "Office") {
      return (
        <div className="flex items-center gap-1 text-xs text-accent font-medium">
          <Briefcase size={14} />
          Office
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
        <Tag size={12} />
        {address.label}
      </div>
    );
  };

  return (
    <div className="relative rounded-2xl border bg-white p-5 space-y-3">
      {/* Default badge */}
      {address.isDefault && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-green-600">
          <CheckCircle size={14} />
          Default
        </div>
      )}

      {/* Address label */}
      {renderLabel()}

      {/* Full Name */}
      <div>
        <p className="text-xs text-gray-500">Full Name</p>
        <p className="text-sm font-medium text-gray-900">{address.name}</p>
      </div>

      {/* Phone */}
      <div>
        <p className="text-xs text-gray-500">Phone</p>
        <p className="text-sm text-gray-800">{address.phone}</p>
      </div>

      {/* Address */}
      <div>
        <p className="text-xs text-gray-500">Address</p>
        <p className="text-sm text-gray-700 wrap-break-word leading-relaxed">
          {address.line1}
          {address.line2 && `, ${address.line2}`}
        </p>
        <p className="text-sm text-gray-700">
          {address.city}, {address.state} – {address.pincode}
        </p>
      </div>

      {/* Actions */}
      <div className="pt-3 flex flex-wrap gap-3 text-sm">
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address)}
            className="px-4 py-1.5 rounded-full bg-accent text-white hover:bg-accent-muted transition"
          >
            Set as default
          </button>
        )}

        <button
          onClick={() => onEdit(address)}
          className="px-4 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(address._id)}
          className="px-4 py-1.5 rounded-full text-red-500 hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
