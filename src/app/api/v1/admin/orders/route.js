import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { OrderModel } from "@/models/order.model";
import { getUserRole } from "@/helpers/getUserId";

export async function GET(request) {
  await dbConnect();

  try {
    const role = await getUserRole(request);
    if (role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(20, Number(searchParams.get("limit") || 10));
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status.toUpperCase();

    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ placedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          `
          _id
          placedAt
          status
          pricing.total
          userId
          shiprocket.awb_code
          shiprocket.status
          `
        )
        .populate("userId", "name email")
        .lean(),

      OrderModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      orders,
    });
  } catch (err) {
    console.error("GET /admin/orders ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
