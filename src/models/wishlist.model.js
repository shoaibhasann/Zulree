import mongoose from "mongoose";


const wishlistItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      default: null,
    },

    sizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
      default: null,
    },

    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      required: true,
    },

    image: {
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercent: {
      type: Number,
      required: true,
      min: 0,
    },

    finalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    notifyOnRestock: {
      type: Boolean,
      default: false,
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);


const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: {
      type: [wishlistItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);


export const WishlistModel =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
