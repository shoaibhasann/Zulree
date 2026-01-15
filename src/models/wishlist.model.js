import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },

    priceAtAdd: Number,
    notifyOnRestock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* 🔥 One user cannot wishlist same variant twice */
wishlistSchema.index({ user: 1, variant: 1 }, { unique: true });

export const WishlistModel =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
