import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { OrderModel } from "@/models/order.model";

import { getUserId } from "@/helpers/getUserId";
import { createOrderSchema } from "@/schemas/createOrderSchema";


export async function GET(request) {
  await dbConnect();

  try {

    const { userId } = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }


    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(20, Number(searchParams.get("limit") || 10));
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;


    const filter = { userId };
    if (status) filter.status = status.toUpperCase();


    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ placedAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "_id placedAt status pricing.total items.trackingNumber items.sku shiprocket.awb_code"
        )
        .lean(),

      OrderModel.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        orders,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /orders ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  await dbConnect();

  try {
    
    const { userId } = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }


    const raw = await request.json().catch(() => ({}));
    const parsed = createOrderSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;


    const order = await OrderModel.create({
      userId,

      items: data.items.map((it) => ({
        productId: it.productId,
        variantId: it.variantId,
        title: it.name,
        name: it.name,
        sku: it.sku,
        hsn: it.hsn,
        units: it.units,
        price: it.price,
        selling_price: it.selling_price,
        discount: it.discount || 0,
        tax: it.tax || 0,
      })),

      pricing: {
        subtotal: data.pricing.subtotal,
        discount: data.pricing.discount || 0,
        shipping: data.pricing.shipping || 0,
        tax: data.pricing.tax || 0,
        total: data.pricing.total,
      },

      billingAddress: data.billingAddress,
      shippingAddress: data.shippingIsBilling
        ? data.billingAddress
        : data.shippingAddress,

      shippingIsBilling: data.shippingIsBilling,

      status: "NEW",

      notes: data.notes,

      shiprocket: {
        channel_order_id: data.channel_order_id,
        pickup_location: data.pickup_location,
        payment_method: data.paymentMethod,
        declared_value: data.pricing.total,
        package_dimensions: data.package_dimensions,
      },

      placedAt: data.placedAt ? new Date(data.placedAt) : new Date(),
    });


    order.statusHistory.push({
      status: "NEW",
      note: "Order created",
      updatedBy: userId,
    });

    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        orderId: order._id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /orders ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
