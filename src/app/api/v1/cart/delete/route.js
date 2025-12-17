import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { CartModel } from "@/models/cart.model";
import { getUserId } from "@/helpers/getUserId";

export async function DELETE(request) {
  await dbConnect();

  try {
    const { userId } = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    const { itemId } = await request.json().catch(() => ({}));
    if (!itemId) {
      return NextResponse.json(
        { success: false, message: "itemId required" },
        { status: 400 }
      );
    }

    const cart = await CartModel.findOne({ userId, isActive: true });
    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    cart.removeItemById(itemId);

    // last item removed → deactivate cart
    if (cart.items.length === 0) {
      cart.isActive = false;
    }

    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: "Item removed from cart",
        cart,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /cart/remove ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
