import api from "@/app/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../hooks";


const initialState = {
  loading: false,
  isAuthenticated: false,
  user: null,
};

export const checkAuth = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/auth/me");
      return res.data.user;
    } catch (error) {
      console.error("Auth check failed:", error);
      return rejectWithValue("Unauthorized");;
    }
  },
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;
