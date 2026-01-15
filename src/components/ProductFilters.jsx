"use client";

import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const STORAGE_KEY = "zulree_product_filters";

/* ------------------ STORAGE HELPERS ------------------ */
function saveFiltersToStorage(params) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
}

function getFiltersFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearFiltersFromStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

/* ------------------ OPTIONS ------------------ */
const PRICE_OPTIONS = [
  { label: "Under ₹499", value: "0-499" },
  { label: "₹500 – ₹999", value: "500-999" },
  { label: "₹1000 – ₹1999", value: "1000-1999" },
];

const SORT_OPTIONS = [
  { label: "Best Selling", value: "best_selling" },
  { label: "Newest", value: "newest" },
  { label: "Trending", value: "trending" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const COLORS = [
  { key: "gold", label: "Gold", bg: "#D4AF37" },
  { key: "silver", label: "Silver", bg: "#C0C0C0" },
  { key: "pink", label: "Pink", bg: "#F472B6" },
  { key: "green", label: "Green", bg: "#4ADE80" },
  { key: "black", label: "Black", bg: "#000000" },
  { key: "multi", label: "Multi", multi: true },
];

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const price = searchParams.get("price") || "";
  const inStock = searchParams.get("inStock") === "true";
  const color = searchParams.get("color") || "";
  const sort = searchParams.get("sort") || "";

  /* ------------------ URL UPDATE ------------------ */
  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === false) params.delete(key);
    else params.set(key, value);

    router.push(`/products?${params.toString()}`);
  }

  function toggleCheckbox(key, value) {
    const current = searchParams.get(key);
    updateParam(key, current === value ? "" : value);
  }

  /* ------------------ SAVE TO LOCALSTORAGE ------------------ */
  useEffect(() => {
    const paramsObj = Object.fromEntries(searchParams.entries());
    console.log("Saving to localStorage params object", paramsObj);
    if (Object.keys(paramsObj).length > 0) {
      saveFiltersToStorage(paramsObj);
    }
  }, [searchParams]);

  /* ------------------ RESTORE ON FIRST LOAD ------------------ */
  useEffect(() => {
    if (searchParams.toString()) return; // URL already has filters

    const stored = getFiltersFromStorage();
    if (!stored) return;

    const params = new URLSearchParams(stored);
    router.replace(`/products?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside className="sticky top-0 space-y-8">
      {/* HEADER */}
      <h3 className="text-lg flex gap-2 items-center font-heading">
        <SlidersHorizontal size={16} />
        Filters
      </h3>

      {/* SORT */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Sort By</p>
        {SORT_OPTIONS.map((s) => (
          <label key={s.value} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sort === s.value}
              onChange={() => toggleCheckbox("sort", s.value)}
              className="accent-pink-600"
            />
            {s.label}
          </label>
        ))}
      </div>

      {/* CATEGORY */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Category</p>
        {["Bracelets", "Earrings", "Necklaces"].map((c) => (
          <label key={c} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={category === c}
              onChange={() => toggleCheckbox("category", c)}
              className="accent-pink-600"
            />
            {c}
          </label>
        ))}
      </div>

      {/* PRICE */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Price</p>
        {PRICE_OPTIONS.map((p) => (
          <label key={p.value} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={price === p.value}
              onChange={() => toggleCheckbox("price", p.value)}
              className="accent-pink-600"
            />
            {p.label}
          </label>
        ))}
      </div>

      {/* AVAILABILITY */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Availability</p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => updateParam("inStock", e.target.checked)}
            className="accent-pink-600"
          />
          In Stock Only
        </label>
      </div>

      {/* COLOR */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Color</p>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((c) => (
            <button
              key={c.key}
              onClick={() => toggleCheckbox("color", c.key)}
              className={`relative w-7 h-7 rounded-full overflow-hidden bg-white transition ${
                color === c.key
                  ? "ring-2 ring-black scale-105"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              {!c.multi && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: c.bg }}
                />
              )}
              {c.multi && (
                <div className="absolute inset-0 grid grid-cols-2">
                  <span className="bg-red-400" />
                  <span className="bg-green-400" />
                  <span className="bg-yellow-400" />
                  <span className="bg-purple-400" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CLEAR */}
      <button
        onClick={() => {
          clearFiltersFromStorage();
          router.push("/products");
        }}
        className="text-sm underline opacity-70 hover:opacity-100"
      >
        Clear all filters
      </button>
    </aside>
  );
}
