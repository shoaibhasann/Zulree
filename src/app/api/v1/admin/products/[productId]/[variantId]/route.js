import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/dbConnect";
import { getUserRole } from "@/helpers/getUserId";
import { isValidObjectId } from "@/helpers/isValidObject";
import { ProductModel } from "@/models/product.model";
import { VariantModel } from "@/models/variant.model";
import { recomputeProductStock } from "@/lib/recomputeStock";
import {
  deleteCloudinaryImages,
  getRemovedImages,
} from "@/helpers/deleteCloudinaryImages";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const role = await getUserRole(request);
    if (role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, variantId } = await params;

    if (!isValidObjectId(productId) || !isValidObjectId(variantId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product or variant ID" },
        { status: 400 }
      );
    }

    const variant = await VariantModel.findOne({
      _id: variantId,
      productId,
    })
      .select("color isActive images sizes")
      .lean();

    if (!variant) {
      return NextResponse.json(
        { success: false, message: "Variant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Variant fetched successfully",
        data: variant,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "GET /admin/products/[productId]/variants/[variantId] ERROR:",
      err
    );
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  await dbConnect();

  try {

    const role = await getUserRole(request);
    if (role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, variantId } = await params;

    if (!isValidObjectId(productId) || !isValidObjectId(variantId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product or variant ID" },
        { status: 400 }
      );
    }

    const product = await ProductModel.findById(productId).select(
      "_id hasVariants images"
    );

    if (!product || !product.hasVariants) {
      return NextResponse.json(
        { success: false, message: "Invalid variant product" },
        { status: 400 }
      );
    }

    const variant = await VariantModel.findOne({
      _id: variantId,
      productId,
    });

    if (!variant) {
      return NextResponse.json(
        { success: false, message: "Variant not found" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "No data provided" },
        { status: 400 }
      );
    }

    if (typeof body.color === "string") {
      variant.color = body.color.trim();
    }

    if (typeof body.isActive === "boolean") {
      variant.isActive = body.isActive;
    }

    if (Array.isArray(body.sizes)) {
      for (const s of body.sizes) {
        if (s._id) {
          const existing = variant.sizes.id(s._id);
          if (!existing) continue;

          if (typeof s.size === "string") {
            existing.size = s.size.trim();
          }

          if (typeof s.stock === "number" && s.stock >= 0) {
            existing.stock = s.stock;
          }

          if (typeof s.sku === "string") {
            existing.sku = s.sku.trim().toLowerCase();
          }

          if (typeof s.isActive === "boolean") {
            existing.isActive = s.isActive;
          }
        } else {

          if (typeof s.size === "string" && typeof s.sku === "string") {
            variant.sizes.push({
              size: s.size.trim(),
              stock: Number(s.stock) >= 0 ? Number(s.stock) : 0,
              sku: s.sku.trim().toLowerCase(),
              isActive: typeof s.isActive === "boolean" ? s.isActive : true,
            });
          }
        }
      }
    }

    if (Array.isArray(body.deletedSizeIds)) {
      variant.sizes = variant.sizes.filter(
        (s) => !body.deletedSizeIds.includes(String(s._id))
      );
    }

    let imagesToDelete = [];

    if (Array.isArray(body.newImages) && body.newImages.length > 0) {
      const variants = await VariantModel.find({ productId }).sort({
        createdAt: 1,
      });

      const variantIndex = variants.findIndex(
        (v) => v._id.toString() === variantId
      );

      const isFirstVariant = variantIndex === 0;

      imagesToDelete = [...variant.images];

      variant.images = body.newImages;

      if (isFirstVariant) {
        product.images = body.newImages;
        await product.save();
      }
    }

    await variant.save();

    await recomputeProductStock(productId);

    if (imagesToDelete.length > 0) {
      deleteCloudinaryImages(
        imagesToDelete.map((img) => img?.public_id).filter(Boolean)
      );
    }

    return NextResponse.json({
      success: true,
      message: "Variant updated successfully",
      variant,
    });
  } catch (err) {
    console.error("PATCH VARIANT ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(request, { params }) {
  await dbConnect();
  const session = await mongoose.startSession();

  try {
    const role = await getUserRole(request);
    if (role !== "Admin") {
      throw new Error("UNAUTHORIZED");
    }

    const { productId, variantId } = await params;
    if (!isValidObjectId(productId) || !isValidObjectId(variantId)) {
      throw new Error("INVALID_ID");
    }

    session.startTransaction();

    const product = await ProductModel.findById(productId).session(session);
    if (!product || !product.hasVariants) {
      throw new Error("INVALID_PRODUCT");
    }

    const variants = await VariantModel.find({ productId })
      .sort({ createdAt: 1 })
      .session(session);

    const variantIndex = variants.findIndex(
      (v) => v._id.toString() === variantId
    );

    if (variantIndex === -1) {
      throw new Error("VARIANT_NOT_FOUND");
    }

    const variantToDelete = variants[variantIndex];

    const imagePublicIds = [];
    variantToDelete.images?.forEach((img) => {
      if (img?.public_id) imagePublicIds.push(img.public_id);
    });

    if (variants.length === 1) {
      product.images?.forEach((img) => {
        if (img?.public_id) imagePublicIds.push(img.public_id);
      });

      await VariantModel.deleteOne({ _id: variantId }).session(session);
      await ProductModel.deleteOne({ _id: productId }).session(session);
    } else {
      if (variantIndex === 0) {
        product.images = variants[1].images;
        await product.save({ session });
      }

      await VariantModel.deleteOne({ _id: variantId }).session(session);
      await recomputeProductStock(productId, {session});
    }

    await session.commitTransaction();

    deleteCloudinaryImages(imagePublicIds);

    return NextResponse.json({
      success: true,
      message:
        variants.length === 1
          ? "Last variant deleted, product removed"
          : "Variant deleted successfully",
    });
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("DELETE VARIANT ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}
