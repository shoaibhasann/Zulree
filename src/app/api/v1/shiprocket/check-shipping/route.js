import { checkShippingService } from "@/lib/shiprocket/services/checkShipping";
import { estimateShippingForUser } from "@/lib/shiprocket/utils/estimateShipping";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("🚚 [Shiprocket] check-shipping route hit");

  try {
    const body = await request.json();
    console.log("📦 Request body:", body);

    if (body.delivery_pincode === process.env.SHIPROCKET_PICKUP_PINCODE) {
      return NextResponse.json({
        success: true,
        user_estimate: {
          shipping_charge: 60,
          delivery_time: "1-2",
          currency: "INR",
        },
        note: "Local delivery",
      });
    }


    // 🔍 Validate required fields early
    const requiredFields = [
      "pickup_pincode",
      "delivery_pincode",
      "weight",
      "cod",
      "product_value",
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined) {
        console.error(`❌ Missing field: ${field}`);
        return NextResponse.json(
          { success: false, error: `Missing field: ${field}` },
          { status: 400 },
        );
      }
    }

    console.log("🔄 Calling checkShippingService with:");
    console.log({
      pickupPincode: body.pickup_pincode,
      deliveryPincode: body.delivery_pincode,
      weight: body.weight,
      cod: body.cod,
      declaredValue: body.product_value,
    });

    const data = await checkShippingService({
      pickupPincode: process.env.SHIPROCKET_PICKUP_PINCODE,
      deliveryPincode: body.delivery_pincode,
      weight: body.weight,
      cod: body.cod ? 1 : 0,
      declaredValue: body.product_value,
    });


    console.log("✅ Shiprocket raw response:", data);

    const companies = data?.data?.available_courier_companies;

    if (!Array.isArray(companies) || companies.length === 0) {
      console.warn("⚠️ No courier companies available");
      return NextResponse.json(
        {
          success: false,
          error: "No delivery services available for this pincode",
        },
        { status: 400 },
      );
    }

    console.log(`📊 ${companies.length} courier companies found`);

    const estimate = estimateShippingForUser(companies);
    console.log("🧮 Estimated shipping:", estimate);

    return NextResponse.json({
      success: true,
      user_estimate: {
        shipping_charge: estimate.approxShippingCharge,
        delivery_time: estimate.approxDeliveryDays,
        currency: "INR",
      },
    });
  } catch (err) {
    console.error("🔥 Shiprocket check-shipping FAILED");
    console.error("👉 Error name:", err?.name);
    console.error("👉 Error message:", err?.message);
    console.error("👉 Full error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Unexpected error while checking shipping",
      },
      { status: 500 },
    );
  }
}
