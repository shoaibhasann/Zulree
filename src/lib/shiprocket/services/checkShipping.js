import shiprocketClient from "../client";

function safeNum(v) {
  if (v === null || v === undefined) return NaN;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const m = v.match(/-?\d+(\.\d+)?/);
    if (m) return Number(m[0]);
  }
  return NaN;
}

function roundUpToNearestTen(num) {
  if (!isFinite(num)) return num;
  return Math.ceil(num / 10) * 10;
}


export async function checkShippingService({
  pickupPincode,
  deliveryPincode,
  weight = 0.5,
  cod = 0,
  declaredValue,
}) {
  if (!pickupPincode || !deliveryPincode) {
    throw new Error("pickupPincode and deliveryPincode are required");
  }

  const params = {
    pickup_postcode: pickupPincode,
    delivery_postcode: deliveryPincode,
    weight,
    cod,
    ...(declaredValue ? { declared_value: declaredValue } : {}),
  };

  const response = await shiprocketClient.get("/courier/serviceability/", {
    params,
  });

  return response.data;
}
