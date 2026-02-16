import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getStorage, setStorage } from "@/app/lib/localStorage";
import api from "@/app/lib/api";

const STORAGE_KEY = "zulree_cart";

/*
Stored cart shape in localStorage:
{
  items: [],
  subtotal: number,
  shipping: number,
  discount: number,
  total: number,
  currency: "INR"
}
*/

const defaultState = {
  items: [],
  subtotal: 0,
  shipping: 70,
  discount: 0,
  total: 0,
  currency: "INR",
  shippingStatus: "idle", // idle | loading | success | error
  shippingError: null,
  syncStatus: "idle",
  syncError: null,
  syncSkippedItems: [],
};

const recalculateTotals = (state) => {
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.priceAt * i.quantity,
    0,
  );

  state.subtotal = Math.round(subtotal);
  state.total = Math.max(0, state.subtotal + state.shipping - state.discount);
};

/* ------------------ LOAD FROM STORAGE ------------------ */
const persistedCart = getStorage(STORAGE_KEY, null);

const initialState = persistedCart
  ? {
      ...defaultState,
      ...persistedCart,
    }
  : defaultState;

/* Ensure totals are correct on load */
recalculateTotals(initialState);


export const estimateShipping = createAsyncThunk(
  "cart/estimateShipping",
  async ({ pincode, total, packageWeight = 0.5 }, { _, rejectWithValue }) => {
    try {

     const res = await api.post("/api/v1/shiprocket/check-shipping", {
             pickup_pincode: "283203", 
             delivery_pincode: pincode,
             weight: packageWeight, 
             cod: false,
             product_value: total,
    });

      return res.data.user_estimate;

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Shipping charges failed to fetch",
      );
    }
  },
);

export const syncCart = createAsyncThunk(
  "cart/syncCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const guestItems = state.cart.items;
      
      if(state.syncStatus === "success") return;
      
      if (!guestItems.length) {
        return { cart: null, skippedItems: [] };
      }

      const res = await api.post("/api/v1/cart/merge", {
        items: guestItems,
      });

      return res.data; // { cart, skippedItems }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to sync cart in DB",
      );
    }
  },
);



const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const qty = Math.max(1, Number(item.quantity || 1));

      const existing = state.items.find(
        (i) =>
          i.productId === item.productId &&
          i.variantId === item.variantId &&
          i.sizeId === item.sizeId,
      );

      if (existing) {
        existing.quantity = Math.min(10, existing.quantity + qty);
        existing.priceAt = item.priceAt;
      } else {
        state.items.push({
          productId: item.productId,
          variantId: item.variantId || null,
          sizeId: item.sizeId || null,
          sku: item.sku,
          title: item.title,
          slug: item.slug,
          image: item.image,
          priceAt: item.priceAt,
          quantity: qty,
        });
      }

      recalculateTotals(state);
      setStorage(STORAGE_KEY, state);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;

      state.items = state.items.filter(
        (i) => i.sku !== itemId && i._id !== itemId,
      );

      recalculateTotals(state);
      setStorage(STORAGE_KEY, state);
    },

    updateQuantity: (state, action) => {
      const { productId, variantId, sizeId, quantity } = action.payload;

      const item = state.items.find(
        (i) =>
          i.productId === productId &&
          i.variantId === variantId &&
          i.sizeId === sizeId,
      );

      if (item) {
        item.quantity = Math.min(10, Math.max(1, quantity));
        recalculateTotals(state);
        setStorage(STORAGE_KEY, state);
      }
    },

    clearCart: (state) => {
      Object.assign(state, defaultState);
      setStorage(STORAGE_KEY, defaultState);
    },

    setShippingCharge: (state, action) => {
      state.shipping = Math.max(0, action.payload);
      recalculateTotals(state);
      setStorage(STORAGE_KEY, state);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(estimateShipping.pending, (state) => {
        state.shippingStatus = "loading";
        state.shippingError = null;
      })
      .addCase(estimateShipping.fulfilled, (state, action) => {
        state.shippingStatus = "success";
        state.shipping = action.payload;
        recalculateTotals(state);
        setStorage(STORAGE_KEY, state);
      })
      .addCase(estimateShipping.rejected, (state, action) => {
        state.shippingStatus = "error";
        state.shippingError = action.payload;
      })
      .addCase(syncCart.pending, (state, action) => {
        state.syncStatus = "loading";
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        const { cart, skippedItems } = action.payload;

        if (!cart) return;

        state.items = cart.items || [];

        recalculateTotals(state);
        setStorage(STORAGE_KEY, state);

        state.syncSkippedItems = skippedItems || [];
        state.syncStatus = "success";
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.syncStatus = "error";
        state.syncError = action.payload;
        console.error("Cart sync failed:", action.payload);
      });

  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setShippingCharge } =
  cartSlice.actions;

export default cartSlice.reducer;
