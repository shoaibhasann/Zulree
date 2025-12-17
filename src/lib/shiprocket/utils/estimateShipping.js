export function estimateShippingForUser(companies) {
  if (!Array.isArray(companies) || companies.length === 0) {
    return {
      approxShippingCharge: null,
      approxDeliveryDays: null,
    };
  }

  // ✅ valid entries
  const validCompanies = companies.filter(
    (c) =>
      typeof c.freight_charge === "number" &&
      c.estimated_delivery_days != null &&
      !isNaN(Number(c.estimated_delivery_days))
  );

  if (validCompanies.length === 0) {
    return {
      approxShippingCharge: null,
      approxDeliveryDays: null,
    };
  }

  // 🔥 sort by cheapest
  const sortedByPrice = [...validCompanies].sort(
    (a, b) => a.freight_charge - b.freight_charge
  );

  // 🟢 cheapest 3
  const selected = sortedByPrice.slice(0, 3);

  // 💰 average price
  const avgPrice =
    selected.reduce((sum, c) => sum + c.freight_charge, 0) / selected.length;

  // 📦 delivery days logic
  const minDays = Math.min(
    ...selected.map((c) => Number(c.estimated_delivery_days))
  );

  let deliveryRange;

  if (minDays < 3) {
    deliveryRange = "3-5 days";
  } else {
    deliveryRange = `${minDays}-${minDays + 1} days`;
  }

  return {
    approxShippingCharge: Math.ceil(avgPrice / 10) * 10 + 10,
    approxDeliveryDays: deliveryRange,
  };
}
