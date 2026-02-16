import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { CartModel } from "@/models/cart.model";
import { ProductModel } from "@/models/product.model";
import { getUserId } from "@/helpers/getUserId";
import { cookies } from "next/headers";

export async function POST(request) {
  await dbConnect();

  try {
    const userId = await getUserId(request);
    
    console.log("UserID", userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const guestItems = Array.isArray(body.items) ? body.items : [];

    if (!guestItems.length) {
      return NextResponse.json({
        success: true,
        message: "Nothing to merge",
      });
    }

    let cart = await CartModel.findOne({ userId, isActive: true });

    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    const skippedItems = [];

    for (const guestItem of guestItems) {
      
      const product = await ProductModel.findById(guestItem.productId);

      if (!product) {
        skippedItems.push({
          productId: guestItem.productId,
          reason: "Product not available",
        });
        continue;
      }

      // 2️⃣ Validate stock (example logic)
      const stockInfo = product.getStock?.(
        guestItem.variantId,
        guestItem.sizeId
      );

      if (!stockInfo.available) {
        skippedItems.push({
          productId: guestItem.productId,
          reason: stockInfo.reason,
        });
        continue;
      }

      // 3️⃣ Safe quantity
      const safeQty = Math.min(
        Math.max(1, Number(guestItem.quantity || 1)),
        stockInfo.stock,
        10
      );

      

      // 4️⃣ Merge safely using DB price
      cart.addOrUpdateItem({
        productId: guestItem.productId,
        variantId: guestItem.variantId,
        sizeId: guestItem.sizeId,
        sku: guestItem.sku,
        title: product.title,
        image: product.image,
        priceAt: product.price,
        quantity: safeQty,
      });
    }

    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: "Cart merged successfully",
        cart,
        skippedItems,
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
