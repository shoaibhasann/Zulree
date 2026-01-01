import { getUserRole } from "@/helpers/getUserId";
import { generateProductSKU } from "@/helpers/skuGenerator";
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

    const sku = generateProductSKU(productData.category);

    const newProduct = await ProductModel.create({
      ...productData,
      sku,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /admin/products error:", err);

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

export async function GET(request) {
  await dbConnect();

  try {

    const role = await getUserRole(request);
    // if (role !== "Admin") {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }


    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);
    const skip = (page - 1) * limit;

    const search = searchParams.get("search");
    const category = searchParams.get("category"); // category.main
    const isActive = searchParams.get("isActive");

    /* -------- FILTER BUILD -------- */
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter["category.main"] = category;
    }

    if (isActive !== null) {
      filter.isActive = isActive === "true";
    }

    /* -------- QUERY -------- */
    const [products, total] = await Promise.all([
      ProductModel.find(filter)
        .select(
          "title slug price discountPercent stock hasVariants images category isActive createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      ProductModel.countDocuments(filter),
    ]);


    return NextResponse.json(
      {
        success: true,
        data: products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /admin/products Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}