import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  sizeId: z.string().min(1),

  sku: z.string().min(1),

  title: z.string().optional(),
  image: z.string().optional(),

  priceAt: z.number().positive(),

  quantity: z.number().int().min(1).max(10).optional().default(1),
});
