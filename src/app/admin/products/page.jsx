"use client";

import { useEffect, useState } from "react";
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



export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { deleteProduct } = useProductActions();

  useEffect(() => {
    async function fetchProducts() {
      try {

        const response = await api.get("/api/v1/admin/products");
        const result = response.data;

        if (result?.success) {
          setProducts(result.data || []);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

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
      {/* Header */}
      <div className="flex items-center justify-between text-white">
        <h1 className="text-xl font-semibold">Products</h1>

        <Button onClick={() => router.push("/admin/products/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Table */}
      {/* Table */}
      <div className="rounded-lg bg-admin-foreground border border-admin-border overflow-hidden">
        <Table>
          {/* HEADER */}
          <TableHeader
            className="bg-admin-foreground
            hover:bg-[#151a34]"
          >
            <TableRow className="bg-admin-bg hover:bg-[#151a34]">
              <TableHead className="text-admin-muted font-medium">
                Product
              </TableHead>
              <TableHead className="text-admin-muted font-medium">
                Category
              </TableHead>
              <TableHead className="text-admin-muted font-medium">
                Price
              </TableHead>
              <TableHead className="text-admin-muted font-medium">
                Stock
              </TableHead>
              <TableHead className="text-admin-muted font-medium">
                Status
              </TableHead>
              <TableHead className="text-right text-admin-muted font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
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

                <TableCell className="text-right">
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
                      <DropdownMenuItem className="text-slate-50 hover:bg-admin-primary"
                        onClick={() => router.push(`/admin/products/${p._id}`)}
                      >
                        View
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-slate-50 hover:bg-admin-primary"
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
    </div>
  );
}
