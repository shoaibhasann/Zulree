export function calculateFinalPrice(price, discountPercent = 0) {
  const safePrice = Number(price) || 0;
  const safeDiscount = Number(discountPercent) || 0;

  if (safeDiscount <= 0) return safePrice;

  return Math.round(safePrice - (safePrice * safeDiscount) / 100);
}
