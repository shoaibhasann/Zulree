import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ProductModel } from "@/models/product.model";
import { escapeRegex } from "@/helpers/escregex";
import { productQuerySchema } from "@/schemas/productQuerySchema";

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

    const {
      q,
      category,
      color,
      instock,
      priceMin,
      priceMax,
      sort,
      page,
      limit,
    } = parsed.data;

    const pipeline = [
      {
        $match: {
          isActive: true,
        },
      },
    ];

    /* 🔍 SEARCH */
    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      pipeline.push({
        $match: {
          $or: [
            { title: regex },
            { description: regex },
            { "category.main": regex },
          ],
        },
      });
    }

    /* 🏷 CATEGORY */
    if (category) {
      pipeline.push({
        $match: {
          $expr: {
            $eq: [{ $toLower: "$category.main" }, category],
          },
        },
      });
    }

    /* 🎨 COLOR (SAFE FOR OLD DATA) */
    if (color) {
      const regex = new RegExp(escapeRegex(color), "i");
      pipeline.push({
        $match: {
          $or: [
            { color: regex},
            { title: regex },
            { description: regex },
          ],
        },
      });
    }

    /* 📦 IN STOCK */
    if (instock === true) {
      pipeline.push({
        $match: {
          availableStock: { $gt: 0 },
        },
      });
    }

    /* 💰 PRICE FILTER */
    if (priceMin !== undefined || priceMax !== undefined) {
      const priceQuery = {};
      if (priceMin !== undefined) priceQuery.$gte = priceMin;
      if (priceMax !== undefined) priceQuery.$lte = priceMax;

      pipeline.push({
        $match: {
          price: priceQuery,
        },
      });
    }

    /* 🔃 SORTING (SAFE FALLBACKS) */
    switch (sort) {
      case "price_asc":
        pipeline.push({ $sort: { price: 1 } });
        break;

      case "price_desc":
        pipeline.push({ $sort: { price: -1 } });
        break;

      case "newest":
        pipeline.push({ $sort: { createdAt: -1 } });
        break;

      case "best_selling":
        pipeline.push({
          $sort: {
            soldCount: -1,
            createdAt: -1,
          },
        });
        break;

      case "trending":
        pipeline.push({
          $sort: {
            lastSoldAt: -1,
            soldCount: -1,
            createdAt: -1,
          },
        });
        break;

      default:
        // relevance / fallback
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    /* 📄 PAGINATION */
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const result = await ProductModel.aggregate(pipeline);

    return NextResponse.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (err) {
    console.error("🔥 GET /products ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
