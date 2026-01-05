import { deleteCloudinaryImages, getRemovedImages } from "@/helpers/deleteCloudinaryImages";
import { getUserRole } from "@/helpers/getUserId";
import { isValidObjectId } from "@/helpers/isValidObject";
import cloudinary from "@/lib/cloudinary";
import { dbConnect } from "@/lib/dbConnect";
import { ProductModel } from "@/models/product.model";
import { VariantModel } from "@/models/variant.model";
import { updateProductSchema } from "@/schemas/updateProductSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { productId } = await params;

    if (!isValidObjectId(productId)) {
      return NextResponse.json(
        { success: false, message: "Product ID is invalid" },
        { status: 400 }
      );
    }

    const product = await ProductModel.findById(productId).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    let variants = [];

   
    if (product.hasVariants) {
      variants = await VariantModel.find({ productId })
        .select("color sku isActive images sizes")
        .lean();
    }

    return NextResponse.json({
      success: true,
      message: "Product fetched successfully",
      data: {
        ...product,
        variants, 
      },
    });
  } catch (err) {
    console.error("GET /admin/products/[productId] ERROR:", err);
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

    const { productId } = await params;

    if (!isValidObjectId(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Product ID" },
        { status: 400 }
      );
    }

    const raw = await request.json().catch(() => ({}));
    const parsed = updateProductSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const body = parsed.data;

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "No data provided to update" },
        { status: 400 }
      );
    }

    const { images, newImages, ...safeBody } = body;

    if (safeBody.slug) {
      const exists = await ProductModel.findOne({
        slug: safeBody.slug,
        _id: { $ne: productId },
      }).lean();

      if (exists) {
        return NextResponse.json(
          { success: false, message: "Slug already in use" },
          { status: 409 }
        );
      }
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    let imagesToDelete = [];

    if (Array.isArray(newImages) && newImages.length > 0) {
     
      imagesToDelete = [...(product.images || [])];


      product.images = newImages;
      await product.save();

      if (product.hasVariants) {
        const firstVariant = await VariantModel.findOne({ productId }).sort({
          createdAt: 1,
        });

        if (firstVariant) {
          firstVariant.images = newImages;
          await firstVariant.save();
        }
      }
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: safeBody },
      { new: true, runValidators: true }
    ).lean();

    if (imagesToDelete.length > 0) {
      await deleteCloudinaryImages(imagesToDelete);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /admin/products/[productId] ERROR:", error);
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

    session.startTransaction();

    const product = await ProductModel.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const imagePublicIds = [];

    if(product.hasVariants){
      const variants = await VariantModel.find({ productId }).session(session);

      variants.forEach((variant) => {
        if(Array.isArray(variant.images)){
          variant.images.forEach((img) => {
            if(img?.public_id) imagePublicIds.push(img.public_id);
          })
        }
      });

      await VariantModel.deleteMany({ productId }).session(session);
    } else {
      if(Array.isArray(product.images)){
        product.images.forEach((img) => {
          if(img?.public_id) imagePublicIds.push(img.public_id);
        })
      }
    }

    await ProductModel.deleteOne({ _id: productId }).session(session);

    await session.commitTransaction();
    session.endSession();

    if (imagePublicIds.length > 0) {
      deleteCloudinaryImages(imagePublicIds);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product, variants & images deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("DELETE /admin/products/[productId] ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

