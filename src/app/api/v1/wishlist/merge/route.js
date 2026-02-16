import { getUserId } from "@/helpers/getUserId";
import { dbConnect } from "@/lib/dbConnect";
import { ProductModel } from "@/models/product.model";
import { VariantModel } from "@/models/variant.model";
import { WishlistModel } from "@/models/wishlist.model";
import { mergeWishlistSchema } from "@/schemas/mergeWishlistSchema";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    console.log("🔥 MERGE ROUTE HIT");

    /* ---------------- AUTH ---------------- */
    const userId = await getUserId(request);
    console.log("UserId:", userId);

    if (!userId) {
      console.log("❌ Unauthorized");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    /* ---------------- VALIDATION ---------------- */
    const raw = await request.json();
    console.log("Incoming body:", raw);

    const result = mergeWishlistSchema.safeParse(raw);

    if (!result.success) {
      console.log("❌ Validation failed:", result.error.flatten());
      return NextResponse.json(
        { success: false, message: result.error.flatten() },
        { status: 400 },
      );
    }

    const guestItems = result.data.items;
    console.log("Guest Items Count:", guestItems.length);

    if (!guestItems.length) {
      console.log("❌ No guest items");
      return NextResponse.json(
        { success: false, message: "No wishlist items provided" },
        { status: 400 },
      );
    }

    /* ---------------- GET OR CREATE WISHLIST ---------------- */
    let wishlist = await WishlistModel.findOne({ user: userId });

    if (!wishlist) {
      console.log("🆕 Creating new wishlist document");
      wishlist = await WishlistModel.create({
        user: userId,
        items: [],
      });
    }

    console.log("Initial DB wishlist items:", wishlist.items.length);

    /* ---------------- PROCESS ITEMS ---------------- */
    for (const item of guestItems) {
      console.log("➡️ Processing item:", item);

      const { productId, variantId, sizeId, notifyOnRestock, addedAt } = item;

      const product = await ProductModel.findById(productId).lean();

      if (!product) {
        console.log("❌ Product not found:", productId);
        continue;
      }

      console.log("✅ Product found:", product.title);

      let price = product.price;
      let discount = product.discountPercent || 0;
      let finalPrice =
        discount > 0 ? Math.ceil(price - (price * discount) / 100) : price;

      let sku = product.sku;
      let image = product.images?.[0] || null;
      let title = product.title;
      let slug = product.slug;

      if (product.hasVariants && variantId) {
        const variant = await VariantModel.findById(variantId).lean();

        if (!variant) {
          console.log("❌ Variant not found:", variantId);
          continue;
        }

        const size = variant.sizes.find(
          (s) => String(s._id) === String(sizeId),
        );

        if (!size) {
          console.log("❌ Size not found:", sizeId);
          continue;
        }

        sku = size.sku || variant.sku || sku;
      }

      /* -------- DUPLICATE CHECK -------- */
      const alreadyExists = wishlist.items.find(
        (i) =>
          String(i.productId) === String(productId) &&
          String(i.variantId || "") === String(variantId || "") &&
          String(i.sizeId || "") === String(sizeId || ""),
      );

      if (alreadyExists) {
        console.log("⚠️ Item already exists, skipping");
        continue;
      }

      console.log("🟢 Pushing item to wishlist");

      wishlist.items.push({
        productId,
        variantId: variantId || null,
        sizeId: sizeId || null,
        title,
        slug,
        sku,
        image,
        price,
        discountPercent: discount,
        finalPrice,
        notifyOnRestock: notifyOnRestock || false,
        addedAt: addedAt ? new Date(addedAt) : new Date(),
      });
    }

    console.log("Before save, wishlist items:", wishlist.items.length);

    await wishlist.save();

    console.log("✅ Wishlist saved");

    /* -------- VERIFY SAVE -------- */
    const verify = await WishlistModel.findOne({ user: userId });
    console.log("After save, DB items:", verify.items.length);

    return NextResponse.json({
      success: true,
      message: "Wishlist merged successfully",
      items: verify.items,
    });
  } catch (error) {
    console.error("❌ POST /wishlist/merge error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
