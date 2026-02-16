import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/app/lib/api";
import { getStorage, setStorage } from "@/app/lib/localStorage";

const STORAGE_KEY = "zulree_wishlist_v1";

/* ------------------ INITIAL STATE ------------------ */
const defaultState = {
  items: [],
  syncStatus: "idle",
  syncError: null,
};

const persisted = getStorage(STORAGE_KEY, null);

const initialState = persisted
  ? { ...defaultState, ...persisted }
  : defaultState;


//   {
//   items: [
//     {
//       productId: string,
//       variantId?: string | null,
//       sizeId?: string | null,
//       notifyOnRestock?: boolean
//     }
//   ]
// }


export const syncWishlist = createAsyncThunk(
  "wishlist/sync",
  async (_, { getState, rejectWithValue }) => {
    try {

      const { items } = getState().wishlist;

      if (!items.length) {
        return [];
      }


      const wishlistItems = items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId || null,
        sizeId: i.sizeId || null,
        notifyOnRestock: i.notifyOnRestock || false,
        addedAt: i.addedAt,
      }));


      const res = await api.post("/api/v1/wishlist/merge", {
        items: wishlistItems
      });
      return res.data.items;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Wishlist sync failed",
      );
    }
  },
);



/**
 * Save / remove single wishlist item (logged-in user)
 */
export const toggleWishlistAPI = createAsyncThunk(
  "wishlist/save",
  async ({ productId, variantId, sizeId, addedAt, notifyOnRestock }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/v1/wishlist", {
        productId,
        variantId,
        sizeId,
        addedAt,
        notifyOnRestock,
      });
      return res.data.items;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Wishlist save failed",
      );
    }
  },
);

/* ------------------ SLICE ------------------ */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;

      const index = state.items.findIndex(
        (i) =>
          i.productId === product.productId &&
          i.variantId === product.variantId &&
          i.sizeId === product.sizeId,
      );


      if (index !== -1) {
        // remove
        state.items.splice(index, 1);
      } else {
        state.items.push({
          productId: product.productId,
          variantId: product.variantId,
          sizeId: product.sizeId,
          title: product.title,
          slug: product.slug,
          sku: product.sku,
          discountPercent: product.discountPercent || 0,
          image: product.image
            ? {
                public_id: product.image.public_id,
                secure_url: product.image.secure_url,
              }
            : null,
          price: product.price,
          finalPrice: product.finalPrice,
          notifyOnRestock: false,
          addedAt: new Date().toISOString(),
        });
      }

      state.syncStatus = "idle";
      setStorage(STORAGE_KEY, {
        items: state.items,
        syncStatus: state.syncStatus
      });
    },

    toggleNotifyOnRestock: (state, action) => {
      const { productId, notifyOnRestock } = action.payload;

      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.notifyOnRestock = notifyOnRestock;
        state.syncStatus = "idle";
        setStorage(STORAGE_KEY, state);
      }
    },

    clearWishlist: (state) => {
      Object.assign(state, defaultState);
      setStorage(STORAGE_KEY, defaultState);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(syncWishlist.pending, (state) => {
        state.syncStatus = "loading";
        state.syncError = null;
      })
      .addCase(syncWishlist.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.syncStatus = "success";
        setStorage(STORAGE_KEY, {
          items: state.items,
          syncStatus: state.syncStatus,
        });
      })
      .addCase(syncWishlist.rejected, (state, action) => {
        state.syncStatus = "error";
        state.syncError = action.payload;
        console.error("Wishlist sync failed:", action.payload);
      })
      .addCase(toggleWishlistAPI.pending, (state) => {
        state.syncStatus = "loading";
        state.syncError = null;
      })
      .addCase(toggleWishlistAPI.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.syncStatus = "success";
        setStorage(STORAGE_KEY, {
          items: state.items,
          syncStatus: state.syncStatus,
        });
      })
      .addCase(toggleWishlistAPI.rejected, (state, action) => {
        state.syncStatus = "error";
        state.syncError = action.payload;
      });
  },
});

export const { toggleWishlist, toggleNotifyOnRestock, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
