import { recomputeProductStock } from "@/lib/recomputeStock";
import mongoose, { Schema } from "mongoose";

const sizeSchema = new Schema(
  {
    size: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true
    },
  },
  { _id: true }
);

const variantSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    images: [
      {
        public_id: {
          type: String,
          required: true,
        },

        secure_url: {
          type: String,
          required: true,
        },
      },
    ],

    sizes: [sizeSchema],
  },
  { timestamps: true }
);


variantSchema.index({ productId: 1, "sizes.sku": 1 }, { unique: true });


variantSchema.pre("save", function () {
  const sizes = this.sizes || [];
  const seen = new Set();

  for (const s of sizes) {
    const normalizedSize = typeof s.size === "string" ? s.size.trim() : s.size;

    if (seen.has(normalizedSize)) {
      throw new Error(
        `Duplicate size "${normalizedSize}" in variant ${this.color}`
      );
    }

    seen.add(normalizedSize);
    s.size = normalizedSize;

    if (typeof s.sku === "string") {
      s.sku = s.sku.trim().toLowerCase();
    }
  }
});



variantSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update?.$set?.sizes) {
    update.$set.sizes = update.$set.sizes.map((s) => ({
      ...s,
      sku: typeof s.sku === "string" ? s.sku.trim().toLowerCase() : s.sku,
    }));
  }

});



variantSchema.post("save", function (doc) {
  recomputeProductStock(doc.productId).catch((err) =>
    console.error("stock recompute save: ", err)
  );
});

variantSchema.post("remove", function (doc) {
  recomputeProductStock(doc.productId).catch((err) =>
    console.error("stock recompute remove: ", err)
  );
});

variantSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    recomputeProductStock(doc.productId).catch(console.error);
  }
});

variantSchema.post("deleteOne", { document: true }, function (doc) {
  if (doc) {
    recomputeProductStock(doc.productId).catch(console.error);
  }
});


export const VariantModel =
  mongoose.models.Variant || mongoose.model("Variant", variantSchema);
