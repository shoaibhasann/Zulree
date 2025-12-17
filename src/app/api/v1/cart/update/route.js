import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { CartModel } from "@/models/cart.model";
import { VariantModel } from "@/models/variant.model";
import { getUserId } from "@/helpers/getUserId";

export async function PATCH(request) {
  await dbConnect();

  try {
    const { userId } = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    const { itemId, quantity } = await request.json().catch(() => ({}));

    if (!itemId || typeof quantity !== "number") {
      return NextResponse.json(
        { success: false, message: "itemId & quantity required" },
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

    const item = cart.items.id(itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, message: "Cart item not found" },
        { status: 404 }
      );
    }

    /* ---- quantity = 0 → remove ---- */
    if (quantity === 0) {
      cart.removeItemById(itemId);

      if (cart.items.length === 0) {
        cart.isActive = false;
      }

      await cart.save();

      return NextResponse.json({
        success: true,
        message: "Item removed from cart",
        cart,
      });
    }

    /* ---- STOCK CHECK ---- */
    const variant = await VariantModel.findOne({
      _id: item.variantId,
      "sizes._id": item.sizeId,
      isActive: true,
    });

    const size = variant?.sizes.id(item.sizeId);
    if (!size || !size.isActive || size.stock < quantity) {
      return NextResponse.json(
        { success: false, message: "Insufficient stock" },
        { status: 409 }
      );
    }

    /* ---- UPDATE QTY ---- */
    item.quantity = Math.min(10, quantity);
    cart.recalculate();
    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: "Cart updated successfully",
        cart,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH /cart/update ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
