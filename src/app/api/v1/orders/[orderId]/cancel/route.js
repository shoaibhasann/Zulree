import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import { OrderModel } from "@/models/order.model";
import { getUserId } from "@/helpers/getUserId";

const CANCELLABLE_STATUSES = ["NEW", "CONFIRMED"];

export async function POST(request, { params }) {
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

    const body = await request.json().catch(() => ({}));
    const reason = body.reason || "Cancelled by user";


    const order = await OrderModel.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Order cannot be cancelled in ${order.status} state`,
        },
        { status: 409 }
      );
    }

    
    order.status = "CANCELLED";

    order.cancellation = {
      cancelledBy: userId,
      reason,
      cancelledAt: new Date(),
      refundAmount: order.payment ? order.pricing.total : 0, 
    };

    order.statusHistory.push({
      status: "CANCELLED",
      note: reason,
      updatedBy: userId,
    });

    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order cancelled successfully",
        orderId: order._id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /orders/[orderId]/cancel ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
