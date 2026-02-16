"use client";

import { useAppSelector } from "@/app/lib/store/hooks";
import AddressCard from "@/components/address/AddressCard";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ClientData from "@/components/ClientData";
import AddressCardSkeleton from "@/components/skeletons/AddressCardSkeleton";
import AddressModal from "@/components/address/AddressModal";
import api from "@/app/lib/api";
import toast from "react-hot-toast";

export default function AddressesPage() {
  const {user, loading} = useAppSelector((state) => state.auth);

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [open, setOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);


  const handleEdit = (address) => {
    setEditAddress(address);
    setOpen(true);
  };


const handleDelete = async (id) => {
  if (!confirm("Delete this address?")) return;

  await toast.promise(api.delete(`/api/v1/user/addresses/${id}`), {
    loading: "Deleting address…",
    success: (res) => {
      setAddresses(res.data.addresses);
      return "Address deleted successfully";
    },
    error: (err) => {
      return err?.response?.data?.error || "Failed to delete address";
    },
  });
};



  const handleSetDefault = async (address) => {
    try {
      const res = await api.patch(`/api/v1/user/addresses/${address._id}/default`);
      setAddresses(res.data.addresses);
      toast.success("Default address updated");
    } catch (err) {
      console.error ("Set default failed", err);
    }
  };

  return (
    <ClientData>
      <div className="px-4 md:px-10 py-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-medium">My Addresses</h1>

          <Button
            onClick={() => {
              setEditAddress(null);
              setOpen(true);
            }}
            className="bg-accent text-white border-0 hover:bg-accent-muted rounded-xl px-5"
          >
            + Add New Address
          </Button>
        </div>

        {addresses.length === 0 && (
          <p className="text-sm text-gray-500">No saved addresses yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <AddressCardSkeleton key={i} />
              ))
            : addresses.map((addr) => (
                <AddressCard
                  key={addr._id}
                  address={addr}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              ))}
        </div>

        <AddressModal
          open={open}
          onClose={() => setOpen(false)}
          initialData={editAddress}
          onSuccess={(updatedAddresses) => {
            setAddresses(updatedAddresses);
            setOpen(false);
          }}
        />
      </div>
    </ClientData>
  );
}
