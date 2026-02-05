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

    title: String,

    slug: String,

    sku: String,

    image: {
      type: {
        public_id: String,
        secure_url: String
      }
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
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });



export const WishlistModel =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
