import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

export const mergeWishlistSchema = z.object({
  items: z
    .array(
      z.object({
        productId: objectIdSchema,
        variantId: objectIdSchema.nullish(),
        sizeId: objectIdSchema.nullish(),
        notifyOnRestock: z.boolean().optional().default(false),
      }),
    )
    .min(1, "Wishlist items required")
    .max(100, "Too many wishlist items"),
});

export const wishlistItemSchema = z.object({
  productId: objectIdSchema,
  variantId: objectIdSchema.nullish(),
  sizeId: objectIdSchema.nullish(),
  notifyOnRestock: z.boolean().optional().default(false),
});
