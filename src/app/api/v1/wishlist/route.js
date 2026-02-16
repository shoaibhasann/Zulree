import { getUserId } from "@/helpers/getUserId";
import { dbConnect } from "@/lib/dbConnect";
import { ProductModel } from "@/models/product.model";
import { VariantModel } from "@/models/variant.model";
import { WishlistModel } from "@/models/wishlist.model";
import { wishlistItemSchema } from "@/schemas/mergeWishlistSchema";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const raw = await request.json();
    const parsed = wishlistItemSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { productId, variantId, sizeId, notifyOnRestock, addedAt } =
      parsed.data;

    let wishlist = await WishlistModel.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await WishlistModel.create({
        user: userId,
        items: [],
      });
    }

    const index = wishlist.items.findIndex(
      (i) =>
        String(i.productId) === String(productId) &&
        String(i.variantId || "") === String(variantId || "") &&
        String(i.sizeId || "") === String(sizeId || ""),
    );

    /* ---------------- REMOVE ---------------- */
    if (index !== -1) {
      wishlist.items.splice(index, 1);
      await wishlist.save();

      return NextResponse.json({
        success: true,
        action: "removed",
        items: wishlist.items,
      });
    }

    /* ---------------- ADD ---------------- */

    const product = await ProductModel.findById(productId).lean();
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    let price = product.price;
    let discountPercent = product.discountPercent || 0;
    let finalPrice =
      discountPercent > 0
        ? Math.ceil(price - (price * discountPercent) / 100)
        : price;

    let sku = product.sku;
    let title = product.title;
    let slug = product.slug;
    let image = product.images?.[0] || null;

    if (product.hasVariants && variantId) {
      const variant = await VariantModel.findById(variantId).lean();
      if (!variant) {
        return NextResponse.json(
          { success: false, message: "Variant not found" },
          { status: 404 },
        );
      }

      const size = variant.sizes.find((s) => String(s._id) === String(sizeId));

      if (!size) {
        return NextResponse.json(
          { success: false, message: "Size not found" },
          { status: 404 },
        );
      }

      sku = size.sku || sku;
    }

    wishlist.items.push({
      productId,
      variantId: variantId || null,
      sizeId: sizeId || null,
      title,
      slug,
      sku,
      image,
      price,
      discount: discountPercent,
      finalPrice,
      notifyOnRestock: notifyOnRestock || false,
      addedAt: addedAt ? new Date(addedAt) : new Date(),
    });

    await wishlist.save();

    return NextResponse.json({
      success: true,
      action: "added",
      items: wishlist.items,
    });
  } catch (error) {
    console.error("Wishlist toggle error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

