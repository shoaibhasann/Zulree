"use client"

import { Spinner } from "@/components/ui/spinner";
import { useAppSelector } from "../lib/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "./components/admin/dashboard/DashboardHeader";

export default function AdminPage() {

  return (
    <div>
      <DashboardHeader />
    </div>
  );
}
