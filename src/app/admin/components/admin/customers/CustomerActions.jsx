"use client";

import api from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { Ban, Eye } from "lucide-react";
import { useRouter } from "next/navigation";


export default function CustomerActions({ user }) {
    const router = useRouter();

  const toggleBlock = async () => {
    try {
      await api.patch(`/admin/customers/${user._id}/block`);
      router.refresh();
    } catch (err) {
      console.error("Failed to update customer status", err);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        onClick={() => router.replace(`/admin/customers/${user._id}`)}
        size="icon"
        variant="outline"
      >
        <Eye className="h-4 w-4 text-black" />
      </Button>

      <Button
        onClick={toggleBlock}
        size="icon"
        variant={user?.isBanned ? "success" : "destructive"}
      >
        <Ban className="h-4 w-4" />
      </Button>
    </div>
  );
}
