"use client";

import { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { ProductsSkeleton } from "../components/admin/skeleton/ProductsSkeleton";
import { useRouter } from "next/navigation";
import StockBadge from "../components/admin/StockBadge";
import api from "@/app/lib/api";
import toast from "react-hot-toast";
import { useProductActions } from "../hooks/useProductActions";

const LIMIT = 10;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const { deleteProduct } = useProductActions();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const response = await api.get(
          `/api/v1/admin/products?page=${page}&limit=${LIMIT}`
        );

        const result = response.data;
        console.log(result)

        if (result?.success) {
          setProducts(result.data || []);
          setTotalPages(result.pagination?.totalPages || 1);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [page]);

  if (loading) {
    return <ProductsSkeleton />;
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <p className="text-base text-admin-muted">No products found</p>
        <Button
          onClick={() => router.push("/admin/products/create")}
          className="mt-4 bg-admin-primary text-white"
        >
          Add your first product
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between text-white">
        <h1 className="text-xl font-semibold">Products</h1>

        <Button onClick={() => router.push("/admin/products/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* TABLE */}
      <div className="rounded-lg bg-admin-foreground border border-admin-border overflow-hidden">
        <Table>
          <TableHeader className="bg-admin-foreground">
            <TableRow className="bg-admin-bg hover:bg-[#151a34]">
              <TableHead className="text-admin-muted">Product</TableHead>
              <TableHead className="text-admin-muted">Category</TableHead>
              <TableHead className="text-admin-muted">Price</TableHead>
              <TableHead className="text-admin-muted">Stock</TableHead>
              <TableHead className="text-admin-muted">Status</TableHead>
              <TableHead className="text-right text-admin-muted">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((p) => (
              <TableRow
                key={p._id}
                onClick={() => router.push(`/admin/products/${p._id}`)}
                className="
                  bg-admin-foreground
                  hover:bg-[#151a34]
                  transition-colors
                  cursor-pointer
                  border-b border-admin-border
                  last:border-b-0
                "
              >
                <TableCell className="font-medium text-white">
                  {p.title}
                </TableCell>

                <TableCell className="text-white">
                  {p.category?.main || "-"}
                </TableCell>

                <TableCell className="text-white">₹{p.price}</TableCell>

                <TableCell className="text-white">
                  {p.stock === 0 ? p.availableStock : p.stock}
                </TableCell>

                <TableCell>
                  <StockBadge
                    stock={p.stock === 0 ? p.availableStock : p.stock}
                  />
                </TableCell>

                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-admin-card"
                      >
                        <MoreHorizontal className="h-4 w-4 text-admin-muted" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="bg-admin-card p-0 border border-slate-400"
                    >
                      <DropdownMenuItem
                        className="text-slate-50 hover:bg-admin-primary"
                        onClick={() => router.push(`/admin/products/${p._id}`)}
                      >
                        View
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-slate-50 hover:bg-admin-primary"
                        onClick={() =>
                          router.push(`/admin/products/${p._id}/edit`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => deleteProduct(p._id)}
                        className="text-admin-danger hover:bg-admin-danger hover:text-slate-50"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-admin-muted">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
