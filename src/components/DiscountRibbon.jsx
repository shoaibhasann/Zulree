export default function DiscountRibbon({ percent = 0 }) {
  if (!percent) return null;

  return (
    <div class="absolute right-0 top-0 z-10 h-16 w-16">
    <div
      class="absolute transform rotate-45 bg-pink-600 text-center text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px]">
      {percent}% off
    </div>
  </div>
  );
}
