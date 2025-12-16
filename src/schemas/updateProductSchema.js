import { BASE_MATERIAL_OPTIONS, MAIN_CATEGORIES, OCCASION_OPTIONS } from "@/helpers/productSpecifications";
import { z } from "zod";



export const updateProductSchema = z
  .object({
    title: z.string().min(2).max(150).optional(),

    slug: z
      .string()
      .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, hyphens only")
      .transform((v) => v.toLowerCase())
      .optional(),

    description: z.string().min(10).max(2000).optional(),

    category: z
      .object({
        main: z.enum(MAIN_CATEGORIES),
        sub: z.string().optional().default(""),
      })
      .optional(),

    price: z.number().min(0).optional(),

    discountPercent: z.number().min(0).max(100).optional(),

    stock: z.number().min(0).optional(),

    hasVariants: z.boolean().optional(),

    images: z
      .array(
        z.object({
          public_id: z.string(),
          secure_url: z.string(),
        })
      )
      .optional(),

    coreSpecs: z
      .object({
        stoneType: z.string().optional(),
        occasion: z.array(z.enum(OCCASION_OPTIONS)).optional(),
        baseMaterial: z
          .union([z.enum(BASE_MATERIAL_OPTIONS), z.string()])
          .optional(),
        quality: z.string().optional(),
        weight_g: z.number().optional(),
        isAuthentic: z.boolean().optional(),
      })
      .optional(),

    isActive: z.boolean().optional(),
  })
  .strict();
