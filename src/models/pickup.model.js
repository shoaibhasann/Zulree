const pickupSchema = new mongoose.Schema(
  {
    srPickupId: { type: Number, required: true, unique: true },
    name: String,
    address: String,
    address_2: String,
    city: String,
    state: String,
    country: String,
    pin_code: String,
    phone: String,
    seller_name: String,
    lat: String,
    long: String,
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PickupModel =
  mongoose.models.Pickup || mongoose.model("Pickup", pickupSchema);
