"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import api from "@/app/lib/api";
import CustomersTable from "../components/admin/customers/CustomersTable";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/admin/customers");
      setCustomers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      c?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>

        <Input
          placeholder="Search by name or email..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Skeleton className="h-[300px] w-full rounded-md" />
      ) : (
        <CustomersTable customers={filteredCustomers} />
      )}
    </div>
  );
}
