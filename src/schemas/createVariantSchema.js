import { z } from "zod";

export const sizeItemSchema = z.object({
  size: z
    .string({ required_error: "Size is required" })
    .trim()
    .min(1, "Size cannot be empty"),
  stock: z
    .number({ required_error: "Stock is required" })
    .int("Stock must be integer")
    .nonnegative()
    .min(0, "Stock cannot be negative"),
  sku: z
    .string({ required_error: "SKU is required" })
    .min(1, "SKU cannot be empty")
    .transform((v) => v.trim().toLowerCase()),
  isActive: z.boolean().optional().default(true),
});

export const singleVariantSchema = z.object({
  color: z
    .string({ required_error: "Color is required" })
    .min(1, "Color cannot be empty"),
  isActive: z.boolean().optional().default(true),
  images: z
    .array(
      z.object({
        public_id: z.string({ required_error: "public_id required" }),
        secure_url: z.string({ required_error: "secure_url required" }),
      })
    ).optional()
   ,
  sizes: z
    .array(sizeItemSchema)
    .min(1, "At least one size is required")
});

export const createMultipleVariantsSchema = z.object({
  variants: z
    .array(singleVariantSchema)
    .min(1, "At least one variant is required")
    .refine(
      (variants) => {
        // ensure no duplicate color within payload for same product (optional)
        const colors = variants.map((v) => v.color.toLowerCase());
        return new Set(colors).size === colors.length;
      },
      { message: "Duplicate variant colors in payload" }
    )
});
