import mongoose, { Schema } from "mongoose";

// Allowed canonical statuses (UPPERCASE)
const ALLOWED_STATUSES = [
  "NEW",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
];

// Normalizer to store canonical uppercase in DB
function normalizeStatus(val) {
  if (typeof val === "string" && val.length) return val.toUpperCase();
  return val;
}

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "Variant",
      required: true,
    },
    title: String,
    name: String, // optional alias for Shiprocket 'name'
    sku: String, // Shiprocket expects sku
    hsn: String, // HSN for tax/compliance
    color: String,
    size: String,
    units: { type: Number, required: true, min: 1 }, // Shiprocket: units
    price: { type: Number, required: true }, // legacy field
    selling_price: { type: Number, required: true }, // explicit Shiprocket price
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
  },
  { _id: true }
);

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ALLOWED_STATUSES,
      required: true,
      set: normalizeStatus,
    },
    note: String,
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const trackingSchema = new Schema(
  {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    shippedAt: Date,
  },
  { _id: false }
);

const couponSchema = new Schema(
  {
    code: String,
    discountAmount: { type: Number, default: 0 },
    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      default: "flat",
    },
  },
  { _id: false }
);

/**
 * shiprocket integration subdocument
 */
const shiprocketHistoryItemSchema = new Schema(
  {
    event: String,
    status: {
      type: String,
      set: normalizeStatus,
    },
    status_code: Number,
    note: String,
    at: { type: Date, default: Date.now },
    raw: {
      type: Schema.Types.Mixed,
      select: false,
    },
  },
  { _id: false }
);

const shiprocketSchema = new Schema(
  {
    order_id: { type: String, index: true }, // Shiprocket order id
    channel_order_id: { type: String, index: true }, // our order id sent to SR
    shipment_id: { type: String },
    awb_code: { type: String, index: true },

    courier_company_id: { type: String },
    courier_name: { type: String },

    // normalize Shiprocket status to uppercase for consistency
    status: { type: String, set: normalizeStatus }, // NEW, MANIFESTED, SHIPPED, DELIVERED, CANCELLED etc.
    status_code: { type: Number },
    packaging_box_error: { type: String },

    payment_method: { type: String }, // 'Prepaid'|'COD'
    cod_amount: { type: Number, default: 0 }, // if COD
    declared_value: { type: Number, default: 0 },

    // package dimensions & weight (helpful for label / manifest)
    package_dimensions: {
      length: { type: Number, default: 0 },
      breadth: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      unit: { type: String, default: "cm" }, // cm/in
      weight: { type: Number, default: 0 },
      weight_unit: { type: String, default: "kg" }, // kg/g
      package_count: { type: Number, default: 1 },
    },

    pickup_location: {
      type: String,
      default: "Home",
    },

    // webhook / external updates (audit trail) - keep raw small or trimmed
    history: {
      type: [shiprocketHistoryItemSchema],
      default: [],
    },

    // last raw small response for debugging (non-sensitive, trimmed)
    rawSmall: { type: Schema.Types.Mixed, select: false },

    // optional pointer to a full raw payload stored elsewhere (S3/Blob) to avoid bloating DB
    rawFullUrl: { type: String },

    // webhook verification metadata
    webhookSignature: String,
    webhookReceivedAt: Date,
    lastWebhookEvent: String,

    // synchronization & retry helpers
    isCreatedOnShiprocket: { type: Boolean, default: false },
    syncAttempts: { type: Number, default: 0 },
    lastSyncAt: Date,
  },
  { _id: true }
);

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: { type: [orderItemSchema], required: true },

    pricing: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      coupon: couponSchema,
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },

    billingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: "India" },
      email: String,
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: "India" },
      email: String,
    },

    shippingIsBilling: {
      type: Boolean,
      default: false,
    },

    shiprocket: { type: shiprocketSchema, default: {} },

    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },

    status: {
      type: String,
      enum: ALLOWED_STATUSES,
      default: "NEW",
      set: normalizeStatus,
      index: true,
    },

    statusHistory: { type: [statusHistorySchema], default: [] },

    tracking: trackingSchema,

    cancellation: {
      cancelledBy: { type: Schema.Types.ObjectId, ref: "User" },
      reason: String,
      cancelledAt: Date,
      refundAmount: { type: Number, default: 0 },
    },

    returns: {
      isReturned: { type: Boolean, default: false },
      returnRequestedAt: Date,
      returnReason: String,
      returnRefundAmount: { type: Number, default: 0 },
    },

    notes: String,
    adminNotes: String,

    placedAt: { type: Date, default: Date.now },
    deliveredAt: Date,
  },
  { timestamps: true }
);

// recent orders for a user
orderSchema.index({ userId: 1, placedAt: -1 });

// admin dashboard: filter by status + recent
orderSchema.index({ status: 1, placedAt: -1 });

// queries often: by transactionId (lookup by payment gateway)
orderSchema.index({ "payment.transactionId": 1 });

// if you will query by tracking number
orderSchema.index({ "tracking.trackingNumber": 1 });

// export
export const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
