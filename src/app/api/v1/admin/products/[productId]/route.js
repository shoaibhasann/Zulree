import { isValidObjectId } from "@/helpers/isValidObject";
import { dbConnect } from "@/lib/dbConnect";
import { ProductModel } from "@/models/product.model";
import { updateProductSchema } from "@/schemas/updateProductSchema";
import { NextResponse } from "next/server";


export async function GET(request, { params }){
  await dbConnect();

  try {
    const { productId } = await params;

    if(!isValidObjectId(productId)){
      return NextResponse.json({
        success: false,
        message: "Product ID is invalid"
      }, { status: 400 });
    }

    const product = await ProductModel.findById(productId);

    if(!product){
      return NextResponse.json({
        success: false,
        message: "Product not found"
      }, { status: 400});
    }

    return NextResponse.json({
      success: true,
      message: "Product fetched successfully",
      data: product
    })
  } catch (error) {
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

    const { productId } = params;
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

    if (body.slug) {
      const exists = await ProductModel.findOne({
        slug: body.slug,
        _id: { $ne: productId },
      }).lean();

      if (exists) {
        return NextResponse.json(
          { success: false, message: "Slug already in use" },
          { status: 409 }
        );
      }
    }

    
    let imagesToDelete = [];

    if (Array.isArray(body.images)) {
      const product = await ProductModel.findById(productId);
      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }

      imagesToDelete = getRemovedImages(product.images || [], body.images);
      product.images = body.images;

      await product.save();
      delete body.images; 
    }


    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: body },
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
  } catch (err) {
    console.error("PATCH /admin/products/[productId] ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
