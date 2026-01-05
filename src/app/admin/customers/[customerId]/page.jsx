"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import api from "@/app/lib/api";
import CustomerActions from "../../components/admin/customers/CustomerActions";
import CustomerInfoCard from "../../components/admin/customers/CustomerInfoCard";

export default function CustomerDetailPage() {
  const { customerId } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/v1/admin/customers/${customerId}`);
      setCustomer(res.data.data);
    } catch (err) {
      console.error("Failed to fetch customer", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!customer) {
    return (
      <p className="text-center text-muted-foreground">Customer not found</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <CustomerInfoCard customer={customer} />
      <CustomerActions customer={customer} refresh={fetchCustomer} />
    </div>
  );
}
