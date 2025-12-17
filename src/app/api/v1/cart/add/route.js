import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { CartModel } from "@/models/cart.model";
import { VariantModel } from "@/models/variant.model";
import { addToCartSchema } from "@/schemas/cartSchema";
import { getUserId } from "@/helpers/getUserId";

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = addToCartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const { userId } = await getUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    /* ---- STOCK CHECK ---- */
    const variant = await VariantModel.findOne({
      _id: data.variantId,
      "sizes._id": data.sizeId,
      isActive: true,
    });

    if (!variant) {
      return NextResponse.json(
        { success: false, message: "Variant not found" },
        { status: 404 }
      );
    }

    const size = variant.sizes.id(data.sizeId);

    if (!size || !size.isActive || size.stock < data.quantity) {
      return NextResponse.json(
        { success: false, message: "Insufficient stock" },
        { status: 409 }
      );
    }

    /* ---- FIND / CREATE CART ---- */
    let cart = await CartModel.findOne({
      userId,
      isActive: true,
    });

    if (!cart) {
      cart = new CartModel({
        userId,
        items: [],
      });
    }

    /* ---- ADD ITEM ---- */
    cart.addOrUpdateItem(data);
    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: "Item added to cart",
        cart,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /cart/add ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
