import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import { OrderModel } from "@/models/order.model";
import { getUserId } from "@/helpers/getUserId";

export async function GET(request, { params }) {
  await dbConnect();

  try {

    const { userId } = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    const { orderId } = await params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { success: false, message: "Invalid orderId" },
        { status: 400 }
      );
    }


    const order = await OrderModel.findOne({
      _id: orderId,
      userId,
    })
      .select(
        `
        _id
        placedAt
        status
        statusHistory
        items
        pricing
        billingAddress
        shippingAddress
        shippingIsBilling
        tracking
        shiprocket.awb_code
        shiprocket.courier_name
        shiprocket.status
        notes
        `
      )
      .lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /orders/[orderId] ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
