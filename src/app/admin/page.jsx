"use client"

import { Spinner } from "@/components/ui/spinner";
import { useAppSelector } from "../lib/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>If you can see sidebar + this text, layout is working ✅</p>
    </div>
  );
}
