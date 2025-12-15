import { getUserRole } from "@/helpers/getUserId";
import { dbConnect } from "@/lib/dbConnect";
import { ProductModel } from "@/models/product.model";
import { createProductSchema } from "@/schemas/createProductSchema";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {

    const role = await getUserRole(request);
    if (role !== "Admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized or page not found",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      console.error(
        "Body validation error while creating product:",
        parsed.error
      );
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed while creating product",
        },
        { status: 400 }
      );
    }

    const productData = { ...parsed.data };

    if (!productData.images || productData.images.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one product image is required",
        },
        { status: 400 }
      );
    }


    if (productData.hasVariants) {
      productData.stock = 0;
      productData.availableStock = 0;
      productData.hasStock = false;
    } else {
      productData.availableStock = productData.stock;
      productData.hasStock = productData.availableStock > 0;
    }


    const newProduct = await ProductModel.create(productData);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /admin/products/create error:", err);

    if (err?.code === 11000) {
      const key = Object.keys(err.keyValue || {}).join(", ");
      return NextResponse.json(
        {
          success: false,
          message: `Duplicate key: ${key}`,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
