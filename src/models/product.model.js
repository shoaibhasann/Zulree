import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: 2,
      maxlength: 150,
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, hyphens only"],
    },

    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 2000,
    },

    category: {
      main: { type: String, required: true, index: true },
      sub: { type: String, default: "", index: true },
    },

    variants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    stock: { type: Number, default: 0, min: 0 },

    availableStock: { type: Number, default: 0, index: true },
    hasStock: { type: Boolean, default: false, index: true },

    hasVariants: { type: Boolean, default: false, index: true },

    sku: { type: String, required: true, unique: true },

    images: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],

    coreSpecs: {
      stoneType: { type: String, default: "N/A" },
      occasion: [{ type: String }],
      baseMaterial: { type: String, default: "" },
      quality: { type: String, default: "" },
      weight_g: { type: Number },
      isAuthentic: { type: Boolean, default: false },
      otherSpecs: [
        {
          type: String,
        },
      ],
    },

    ratings: { type: Number, default: 0, max: 5 },
    numberOfReviews: { type: Number, default: 0 },

    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],

    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre("save", function () {
  if (this.sku && typeof this.sku === "string") {
    this.sku = this.sku.trim().toLowerCase();
  }
});



// ******** VIRTUALS ********
productSchema.virtual("finalPrice").get(function () {
  const p = this.price || 0;
  const d = this.discountPercent || 0;
  if (d <= 0) return p;
  return Math.round((p - (p * d) / 100) * 100) / 100;
});

productSchema.virtual("isVariantProduct").get(function () {
  return this.hasVariants;
});

productSchema.virtual("computedStock").get(function () {
  return this.hasVariants ? this.availableStock : this.stock;
});


export const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);
