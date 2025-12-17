import mongoose from "mongoose";
const { Schema } = mongoose;


const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    variantId: {
      type: Schema.Types.ObjectId,
      ref: "Variant",
      required: true,
    },

    sizeId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    sku: { type: String, required: true }, 

    title: { type: String }, 
    image: { type: String },

    priceAt: { type: Number, required: true },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  { _id: true }
);


const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: false,
    },

    guestId: {
      type: String,
      index: true,
      required: false,
    },

    items: [cartItemSchema],

    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    currency: { type: String, default: "INR" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


cartSchema.index({
  userId: 1,
  "items.productId": 1,
  "items.variantId": 1,
  "items.sizeId": 1,
});


cartSchema.methods.recalculate = function () {
  const subtotal = (this.items || []).reduce(
    (sum, i) => sum + (i.priceAt || 0) * (i.quantity || 0),
    0
  );

  this.subtotal = Math.round(subtotal);
  this.total = Math.max(
    0,
    this.subtotal + (this.shipping || 0) - (this.discount || 0)
  );

  return this;
};


cartSchema.methods.addOrUpdateItem = function (item) {
  const qty = Math.max(1, Number(item.quantity || 1));

  const existing = this.items.find(
    (i) =>
      String(i.productId) === String(item.productId) &&
      String(i.variantId) === String(item.variantId) &&
      String(i.sizeId) === String(item.sizeId)
  );

  if (existing) {
    existing.quantity = Math.min(10, existing.quantity + qty);
    existing.priceAt = item.priceAt;
  } else {
    this.items.push({
      productId: item.productId,
      variantId: item.variantId,
      sizeId: item.sizeId,
      sku: item.sku,
      title: item.title,
      image: item.image,
      priceAt: item.priceAt,
      quantity: qty,
    });
  }

  return this.recalculate();
};


cartSchema.methods.removeItemById = function (itemId) {
  this.items = this.items.filter((i) => String(i._id) !== String(itemId));
  return this.recalculate();
};

// merge guest cart → user cart
cartSchema.methods.mergeFrom = async function (guestCart) {
  if (!guestCart?.items?.length) return this;

  for (const it of guestCart.items) {
    this.addOrUpdateItem(it);
  }

  guestCart.isActive = false;
  await guestCart.save();

  return this;
};

export const CartModel =
  mongoose.models.Cart || mongoose.model("Cart", cartSchema);
