import crypto from "crypto";

export function generateProductSKU(category) {
  const year = new Date().getFullYear().toString().slice(-2);

  const mainCategory = typeof category === "string" ? category : category?.main;

  if (!mainCategory || typeof mainCategory !== "string") {
    throw new Error("Invalid category for SKU generation");
  }

  const cat = mainCategory.slice(0, 2).toUpperCase();
  const rand = crypto.randomInt(1000, 9999);

  return `P${year}${cat}${rand}`;
}

export function generateVariantSKU(productId, size, color) {
  const p = productId.toString().slice(-4).toUpperCase();
  const s = String(size).replace(/\W/g, "").slice(0, 2).toUpperCase();
  const c = color?.[0]?.toUpperCase() || "X";
  const r = crypto.randomInt(100, 999);

  return `V${p}${c}${s}${r}`;
}
