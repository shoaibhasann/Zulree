import mongoose, { Schema } from "mongoose";
import { recomputeProductStock } from "@/lib/recomputeStock";

const selectedOptionSchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const variantSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },


    sku: {
      type: String,
      required: true,
    },

    // Variant-level price override (optional)
    price: { type: Number },

    // variant-level stock
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // chosen option values for this variant
    selectedOptions: [selectedOptionSchema],

    // variant-level images
    images: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);



// Useful for filtering variants
variantSchema.index({
  "selectedOptions.name": 1,
  "selectedOptions.value": 1,
});


// After saving or deleting variant → recompute main product stock
variantSchema.post("save", function (doc) {
  recomputeProductStock(doc.productId).catch((err) =>
    console.error("Variant save stock update error:", err)
  );
});

variantSchema.post("remove", function (doc) {
  recomputeProductStock(doc.productId).catch((err) =>
    console.error("Variant remove stock update error:", err)
  );
});

export const VariantModel =
  mongoose.models.Variant || mongoose.model("Variant", variantSchema);

export default VariantModel;
