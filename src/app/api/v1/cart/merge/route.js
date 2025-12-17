import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { CartModel } from "@/models/cart.model";
import { getUserId } from "@/helpers/getUserId";

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

    const body = await request.json().catch(() => ({}));
    const guestItems = Array.isArray(body.items) ? body.items : [];

    if (guestItems.length === 0) {
      return NextResponse.json({ success: true, message: "Nothing to merge" });
    }

    let cart = await CartModel.findOne({ userId, isActive: true });
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    for (const item of guestItems) {
      cart.addOrUpdateItem(item);
    }

    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: "Cart merged successfully",
        cart,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /cart/merge ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
