import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/dbConnect";
import { getUserRole } from "@/helpers/getUserId";
import { generateVariantSKU } from "@/helpers/skuGenerator";
import { ProductModel } from "@/models/product.model";
import { VariantModel } from "@/models/variant.model";
import { recomputeProductStock } from "@/lib/recomputeStock";
import { createMultipleVariantsSchema } from "@/schemas/createVariantSchema";
import { isValidObjectId } from "@/helpers/isValidObject";

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


    const raw = await request.json().catch(() => ({}));
    const parsed = createMultipleVariantsSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const variantsPayload = parsed.data.variants;

  
    const product = await ProductModel.findById(productId).select("_id images");
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }


    const docsToInsert = variantsPayload.map((v) => ({
      productId,
      ...v,
      sizes: v.sizes.map((s) => ({
        ...s,
        sku: generateVariantSKU(productId, s.size, v.color),
      })),
    }));


    const session = await mongoose.startSession();
    let createdVariants = [];

    try {
      await session.withTransaction(async () => {
        const insertRes = await VariantModel.insertMany(docsToInsert, {
          session,
        });

        createdVariants = insertRes;

        const firstVariantImage = insertRes[0]?.images?.[0];
        if (
          (!product.images || product.images.length === 0) &&
          firstVariantImage
        ) {
          await ProductModel.findByIdAndUpdate(
            productId,
            { $set: { images: [firstVariantImage] } },
            { session }
          );
        }

        await recomputeProductStock(productId, { session });
      });

      return NextResponse.json(
        {
          success: true,
          message: "Variants created successfully",
          variants: createdVariants,
        },
        { status: 201 }
      );
    } catch (txnErr) {
      console.error("Bulk variant transaction failed:", txnErr);

      if (txnErr?.code === 11000) {
        return NextResponse.json(
          { success: false, message: "Duplicate SKU detected" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: txnErr.message || "Transaction failed",
        },
        { status: 500 }
      );
    } finally {
      session.endSession();
    }
  } catch (err) {
    console.error("POST /admin/products/[productId]/variant/bulk error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
