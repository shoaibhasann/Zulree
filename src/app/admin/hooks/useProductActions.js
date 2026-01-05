"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/app/lib/api";

export function useProductActions() {
  const router = useRouter();

  const deleteProduct = async (productId) => {
    toast.promise(api.delete(`/api/v1/admin/products/${productId}`), {
      loading: "Deleting product...",
      success: () => {
        router.push("/admin/products");
        return "Product deleted successfully";
      },
      error: (err) =>
        err?.response?.data?.message || "Failed to delete product",
    });
  };

  return {
    deleteProduct,
  };
}
