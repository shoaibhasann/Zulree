export default function CheckoutAddressSummary({ address }) {
  if (!address) return null;

  return (
    <div className="rounded-xl p-4 text-gray-800 space-y-1">
      <p className="text-sm font-medium text-gray-800">
        {address.label || "Address"} • {address.line1}, {address.line2},  {address.city}, {address.state}{" "}
        {address.pincode}, {address.country}
      </p>

      <p className="text-sm font-medium text-gray-800">
        Phone number: {address.phone}
      </p>
    </div>
  );
}
