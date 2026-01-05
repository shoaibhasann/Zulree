"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// TEMP data (UI-only)
const orders = [
  {
    id: "ORD-1001",
    customer: "Aman Khan",
    status: "PENDING",
    amount: 1299,
    createdAt: "2025-12-17",
  },
  {
    id: "ORD-1002",
    customer: "Bushra",
    status: "SHIPPED",
    amount: 2499,
    createdAt: "2025-12-16",
  },
];

function StatusBadge({ status }) {
  const map = {
    PENDING: "secondary",
    SHIPPED: "default",
    DELIVERED: "success",
    CANCELLED: "destructive",
  };
  return <Badge variant={map[status] || "secondary"}>{status}</Badge>;
}

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-white font-semibold">Orders</h1>
      </div>

      <div className="rounded-md border border-slate-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Order</TableHead>
              <TableHead className="text-muted-foreground">Customer</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Amount</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-right text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((o) => (
              <TableRow className="text-white" key={o.id}>
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell>
                  <StatusBadge status={o.status} />
                </TableCell>
                <TableCell>₹{o.amount}</TableCell>
                <TableCell>{o.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/orders/${o.id}`}>
                    <Button className="text-black" size="sm" variant="outline">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
