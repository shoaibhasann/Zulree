// app/api/v1/admin/orders/create-shipment/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import OrderModel from "@/models/order.model";
import { createShipmentService } from "@/lib/shiprocket/services/createShipment";

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "orderId is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // 🔒 Prevent double shipment
    if (order.shipment?.shipment_id) {
      return NextResponse.json(
        { success: false, error: "Shipment already created" },
        { status: 400 }
      );
    }

    // 🔹 Build payload from DB
    const shiprocketResponse = await createShipmentService({
      orderId: order.orderNumber,
      orderDate: new Date().toISOString().split("T")[0],
      pickupLocation: "Home", // must match Shiprocket dashboard

      billing: order.billingAddress,
      shipping: order.shippingAddress,

      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),

      paymentMethod: order.paymentMethod,
      subTotal: order.subTotal,

      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.5,
    });

    // 🔹 Save shipment info
    order.shipment = {
      shipment_id: shiprocketResponse.shipment_id,
      awb_code: shiprocketResponse.awb_code,
      courier: shiprocketResponse.courier_company_name,
    };

    order.status = "SHIPPED";
    await order.save();

    return NextResponse.json({
      success: true,
      shipment: order.shipment,
    });
    
  } catch (err) {
    console.error("create-shipment DB error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
