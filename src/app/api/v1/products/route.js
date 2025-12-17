import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ProductModel } from "@/models/product.model";
import { escapeRegex } from "@/helpers/escregex";
import { productQuerySchema } from "@/schemas/productquerySchema";

export async function GET(request) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const rawQuery = Object.fromEntries(url.searchParams.entries());

    const parsed = productQuerySchema.safeParse(rawQuery);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid query params" },
        { status: 400 }
      );
    }

    const { q, category, priceMin, priceMax, sort, page, limit } = parsed.data;

    const pipeline = [
      {
        $match: {
          isActive: true,
          hasStock: true,
        },
      },

      // 🔥 Compute finalPrice dynamically
      {
        $addFields: {
          finalPrice: {
            $round: [
              {
                $subtract: [
                  "$price",
                  {
                    $multiply: [
                      "$price",
                      { $divide: ["$discountPercent", 100] },
                    ],
                  },
                ],
              },
              0,
            ],
          },
        },
      },
    ];

    // 🔍 Search
    if (q) {
      const re = new RegExp(escapeRegex(q), "i");
      pipeline.push({
        $match: {
          $or: [{ title: re }, { description: re }],
        },
      });
    }

    // 🏷 Category filter
    if (category) {
      pipeline.push({
        $match: { "category.main": category },
      });
    }

    // 💰 Price filter
    if (priceMin !== undefined || priceMax !== undefined) {
      const priceCond = {};
      if (priceMin !== undefined) priceCond.$gte = priceMin;
      if (priceMax !== undefined) priceCond.$lte = priceMax;

      pipeline.push({
        $match: { finalPrice: priceCond },
      });
    }

    // 🔃 Sorting
    let sortStage = { createdAt: -1, _id: -1 };
    if (sort === "price_asc") sortStage = { finalPrice: 1, _id: -1 };
    else if (sort === "price_desc") sortStage = { finalPrice: -1, _id: -1 };
    else if (sort === "best_selling") sortStage = { soldCount: -1, _id: -1 };

    const skip = (page - 1) * limit;

    pipeline.push({
      $facet: {
        meta: [{ $count: "total" }],
        data: [
          { $sort: sortStage },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              title: 1,
              slug: 1,
              images: 1,
              category: 1,
              price: 1,
              discountPercent: 1,
              finalPrice: 1,
              availableStock: 1,
              hasStock: 1,
              ratings: 1,
              numberOfReviews: 1,
              createdAt: 1,
            },
          },
        ],
      },
    });

    const result = await ProductModel.aggregate(pipeline);

    const meta = result[0]?.meta?.[0] || { total: 0 };
    const data = result[0]?.data || [];

    return NextResponse.json(
      {
        success: true,
        meta: {
          total: meta.total,
          page,
          limit,
          totalPages: Math.ceil(meta.total / limit),
        },
        data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /products ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
