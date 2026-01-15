import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ProductModel } from "@/models/product.model";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { slug } = await params;

   
    const currentProduct = await ProductModel.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!currentProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Related products query
    const relatedProducts = await ProductModel.find({
      _id: { $ne: currentProduct._id }, // exclude current
      isActive: true,
      $or: [
        { "category.sub": currentProduct.category.sub },
        { "category.main": currentProduct.category.main },
      ],
    })
      .select("title slug price discountPercent images category")
      .limit(8)
      .lean();

    // 3️⃣ Compute finalPrice (important)
    const formatted = relatedProducts.map((p) => {
      const discount = p.discountPercent || 0;
      const price = p.price || 0;

      return {
        ...p,
        finalPrice:
          discount > 0 ? Math.round(price - (price * discount) / 100) : price,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    console.error("RELATED PRODUCTS ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
