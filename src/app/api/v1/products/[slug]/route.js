import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ProductModel } from "@/models/product.model";
import { VariantModel } from "@/models/variant.model";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { slug } = params;

    const product = await ProductModel.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    let variants = [];

    if (product.hasVariants) {
      variants = await VariantModel.find({
        productId: product._id,
        isActive: true,
      })
        .select("color images sizes isActive")
        .lean();
    }

    return NextResponse.json(
      {
        success: true,
        product,
        variants,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /products/[slug] ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
