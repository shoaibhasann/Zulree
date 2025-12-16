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

    const { productId, variantId } = params;

    if (!isValidObjectId(productId) || !isValidObjectId(variantId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Product or Variant ID" },
        { status: 400 }
      );
    }

    const product =
      await ProductModel.findById(productId).select("_id hasVariants");

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

    const variant = await VariantModel.findOne({
      _id: variantId,
      productId,
    });

    if (!variant) {
      return NextResponse.json(
        { success: false, message: "Variant not found for this product" },
        { status: 404 }
      );
    }

    const body = await request.json().catch(() => ({}));

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "No data provided to update" },
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
      for (const incomingSize of body.sizes) {
        const existingSize = variant.sizes.id(incomingSize._id);
        if (!existingSize) continue;

        if (typeof incomingSize.stock === "number") {
          existingSize.stock = incomingSize.stock;
        }

        if (typeof incomingSize.isActive === "boolean") {
          existingSize.isActive = incomingSize.isActive;
        }
      }
    }

    let imagesToDelete = [];

    if (Array.isArray(body.images)) {
      const oldImages = variant.images || [];
      const newImages = body.images;

      imagesToDelete = getRemovedImages(oldImages, newImages);

      variant.images = newImages;
    }

    await variant.save();

    await recomputeProductStock(productId);

    if (imagesToDelete.length > 0) {
      await deleteCloudinaryImages(imagesToDelete);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Variant updated successfully",
        variant,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH /admin/products/[productId]/[variantId]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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
        { success: false, message: "Invalid Product or Variant ID" },
        { status: 400 }
      );
    }

    
    const product =
      await ProductModel.findById(productId).select("_id hasVariants");
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


    const variant = await VariantModel.findOne({
      _id: variantId,
      productId,
    });

    if (!variant) {
      return NextResponse.json(
        { success: false, message: "Variant not found for this product" },
        { status: 404 }
      );
    }

    const imagePublicIds = (variant.images || []).map((img) => img.public_id);


    await VariantModel.deleteOne({ _id: variantId });

    await recomputeProductStock(productId);

    
    if (imagePublicIds.length > 0) {
      await deleteCloudinaryImages(imagePublicIds);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Variant and its images deleted successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE VARIANT ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}