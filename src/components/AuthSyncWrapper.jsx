"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
import { syncCart } from "@/app/lib/store/features/cart/cartSlice";
import { syncWishlist } from "@/app/lib/store/features/wishlist/wishlistSlice";

export default function AuthSyncWrapper({ children }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartSyncStatus = useAppSelector((state) => state.cart.syncStatus);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const wishlistSyncStatus = useAppSelector((state) => state.wishlist.syncStatus);


  useEffect(() => {

    if (isAuthenticated && cartItems.length > 0 && cartSyncStatus !== "loading" && !loading) {
      dispatch(syncCart());
    }

    if(isAuthenticated && wishlistItems.length > 0 && wishlistSyncStatus !== "loading" && !loading){
      dispatch(syncWishlist());
    }

  }, [isAuthenticated]);

  return children;
}
