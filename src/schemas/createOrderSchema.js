import { z } from "zod";

export const createOrderSchema = z.object({
  channel_order_id: z.string().min(1, "channel_order_id is required"),
  placedAt: z.string().datetime().optional(),
  pickup_location: z.string().min(1, "pickup_location is required"),
  notes: z.string().optional(),
  reseller_name: z.string().optional(),
  company_name: z.string().optional(),

  billingAddress: z.object({
    fullName: z.string().min(1, "billing fullName is required"),
    lastName: z.string().optional().default(""),
    phone: z.string().min(8, "billing phone is required"),
    street: z.string().min(1, "billing street is required"),
    street2: z.string().optional(),
    city: z.string().min(1, "billing city is required"),
    state: z.string().min(1, "billing state is required"),
    postalCode: z.string().min(4, "billing postalCode is required"),
    country: z.string().min(1, "billing country is required"),
    email: z.string().email("invalid email"),
  }),

  shippingAddress: z.object({
    fullName: z.string().min(1, "shipping fullName is required"),
    lastName: z.string().optional().default(""),
    phone: z.string().min(8, "shipping phone is required"),
    street: z.string().min(1, "shipping street is required"),
    street2: z.string().optional(),
    city: z.string().min(1, "shipping city is required"),
    state: z.string().min(1, "shipping state is required"),
    postalCode: z.string().min(4, "shipping postalCode is required"),
    country: z.string().min(1, "shipping country is required"),
    email: z.string().email("invalid email"),
  }),

  shippingIsBilling: z.boolean().default(true),

  items: z
    .array(
      z.object({
        productId: z.string().optional(),
        variantId: z.string().optional(),
        name: z.string().min(1, "item name is required"),
        sku: z.string().min(1, "item sku is required"),
        units: z.number().min(1, "units must be at least 1"),
        selling_price: z.number().nonnegative(),
        discount: z.number().nonnegative().optional().default(0),
        tax: z.number().nonnegative().optional().default(0),
        hsn: z.string().optional(),
        price: z.number().nonnegative(),
      })
    )
    .min(1, "at least one item is required"),

  pricing: z.object({
    subtotal: z.number().nonnegative(),
    discount: z.number().nonnegative().optional().default(0),
    shipping: z.number().nonnegative().optional().default(0),
    tax: z.number().nonnegative().optional().default(0),
    total: z.number().nonnegative(),
  }),

  paymentMethod: z.enum(["Prepaid", "COD"]),

  package_dimensions: z.object({
    length: z.number().positive(),
    breadth: z.number().positive(),
    height: z.number().positive(),
    weight: z.number().positive(),
    weight_unit: z.string().default("kg"),
    package_count: z.number().positive().default(1),
  }),

  invoice_number: z.string().optional(),
  order_type: z.string().default("ESSENTIALS"),
});
