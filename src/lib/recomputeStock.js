import mongoose from "mongoose";
import { VariantModel } from "@/models/variant.model";
import { ProductModel } from "@/models/product.model";

export async function recomputeProductStock(productId, opts = {}) {
  const { session } = opts;
  if (!productId) return 0;

  const pid =
    productId instanceof mongoose.Types.ObjectId
      ? productId
      : new mongoose.Types.ObjectId(String(productId));

  const agg = await VariantModel.aggregate(
    [
      { $match: { productId: pid, isActive: true } },
      { $unwind: "$sizes" },
      { $match: { "sizes.isActive": true } },
      {
        $group: {
          _id: null,
          total: { $sum: "$sizes.stock" },
        },
      },
    ],
    session ? { session } : {}
  );

  const total = agg?.[0]?.total ?? 0;

  await ProductModel.findByIdAndUpdate(
    pid,
    { availableStock: total, hasStock: total > 0 },
    { session }
  );

  return total;
}

