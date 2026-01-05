import { getUserRole } from "@/helpers/getUserId";
import { isValidObjectId } from "@/helpers/isValidObject";
import { dbConnect } from "@/lib/dbConnect";
import { recomputeProductStock } from "@/lib/recomputeStock";
import { ProductModel } from "@/models/product.model";
import { VariantModel } from "@/models/variant.model";
import { singleVariantSchema } from "@/schemas/createVariantSchema";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  await dbConnect();

  try {
    
    const role = await getUserRole(request);
    if (role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await params;

    if (!isValidObjectId(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Product ID" },
        { status: 400 }
      );
    }

    
    const product = await ProductModel.findById(productId).select(
      "_id images stock hasVariants"
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (!product.hasVariants) {
      return NextResponse.json(
        {
          success: false,
          message: "This product is not configured for variants",
        },
        { status: 400 }
      );
    }


    const raw = await request.json().catch(() => ({}));
    const parsed = singleVariantSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          error: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const variantPayload = parsed.data;
    const sizes = Array.isArray(variantPayload.sizes)
      ? variantPayload.sizes
      : [];

    
    for (const s of sizes) {
      if (typeof s.sku !== "string" || !s.sku.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Every size must have a valid SKU",
          },
          { status: 400 }
        );
      }
    }

    const payloadSkus = sizes
      .map((s) => s.sku.trim().toLowerCase())
      .filter(Boolean);

    if (payloadSkus.length === 0) {
      return NextResponse.json(
        { success: false, message: "No SKUs provided" },
        { status: 400 }
      );
    }

    const existing = await VariantModel.findOne({
      "sizes.sku": { $in: payloadSkus },
    }).lean();

    if (existing) {
      return NextResponse.json(
        { success: false, message: "SKU already exists" },
        { status: 409 }
      );
    }

    
    const variantCount = await VariantModel.countDocuments({ productId });
    const isFirstVariant = variantCount === 0;

    if(isFirstVariant){
      product.stock = variantPayload.sizes[0].stock;
      await product.save();
    }


    const newVariant = await VariantModel.create({
      productId,
      ...variantPayload,
      images: isFirstVariant ? product.images : variantPayload.images
    });


    await recomputeProductStock(productId);

    return NextResponse.json(
      {
        success: true,
        message: "Variant added successfully",
        variant: newVariant,
        isFirstVariant,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("create variant error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
