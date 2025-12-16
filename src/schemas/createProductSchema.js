import { z } from "zod";

const MAIN_CATEGORIES = [
  "Bangles",
  "Bracelets",
  "Necklaces",
  "Korean Jewellery",
  "Rings",
  "Earrings",
  "Hair Accessories",
  "Boxes",
  "Other",
];

const OCCASION_OPTIONS = [
  "Daily Wear",
  "Office Wear",
  "Casual",
  "Festive",
  "Party Wear",
  "Wedding",
  "Engagement",
  "Bridal",
  "Gifting",
  "Traditional",
  "Ethnic",
  "Modern",
];

const BASE_MATERIAL_OPTIONS = [
  "Alloy",
  "Brass",
  "Copper",
  "Silver",
  "Sterling Silver 925",
  "Gold",
  "Gold Plated",
  "Rose Gold Plated",
  "Oxidized Silver",
  "Kundan Base",
  "Lac",
  "Thread",
  "Beads",
  "Stainless Steel",
];

export const createProductSchema = z
  .object({
    title: z.string().min(2).max(150),

    slug: z
      .string()
      .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, hyphens only")
      .transform((v) => v.toLowerCase()),

    description: z.string().min(10).max(2000),

    category: z.object({
      main: z.enum(MAIN_CATEGORIES),
      sub: z.string().optional().default(""),
    }),

    price: z.number().min(0),

    discountPercent: z.number().min(0).max(100).optional().default(0),

    stock: z.number().min(0).optional().default(0),

    hasVariants: z.boolean().optional().default(false),

    images: z
      .array(
        z.object({
          public_id: z.string(),
          secure_url: z.string(),
        })
      )
      .optional()
      .default([]),

    coreSpecs: z
      .object({
        stoneType: z.string().optional().default("N/A"),
        occasion: z.array(z.enum(OCCASION_OPTIONS)).optional().default([]),
        baseMaterial: z
          .union([z.enum(BASE_MATERIAL_OPTIONS), z.string()])
          .optional()
          .default(""),
        quality: z.string().optional().default(""),
        weight_g: z.number().optional(),
        isAuthentic: z.boolean().optional().default(false),
      })
      .optional()
      .default({}),
      
    isActive: z.boolean().optional().default(true),
  });
