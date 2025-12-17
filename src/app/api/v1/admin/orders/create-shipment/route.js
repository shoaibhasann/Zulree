import { NextResponse } from "next/server";
import { createShipmentService } from "@/lib/shiprocket/services/createShipment";
// import OrderModel from "@/models/order.model";

export async function POST(req) {
  try {
    const body = await req.json();

    // 🔹 Normally: fetch order from DB using body.orderId
    // const order = await OrderModel.findById(body.orderId);

    const shiprocketRes = await createShipmentService(body);

    return NextResponse.json({
      success: true,
      shipment: {
        shipment_id: shiprocketRes.shipment_id,
        awb_code: shiprocketRes.awb_code,
        courier: shiprocketRes.courier_company_name,
      },
    });
  } catch (err) {
    console.error("create-shipment error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
