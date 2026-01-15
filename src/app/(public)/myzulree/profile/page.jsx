"use client";

import Image from "next/image";
import { User, Mail, Phone, Edit } from "lucide-react";

export default function MyProfilePage() {
  return (
    <section className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      {/* 🔹 PAGE TITLE */}
      <h1 className="text-2xl md:text-3xl font-heading mb-8">My Profile</h1>

      {/* 🔹 PROFILE CARD */}
      <div className="bg-white border border-border rounded-2xl p-6 flex items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center text-lg font-medium">
            S
          </div>

          <div>
            <p className="text-base font-medium">Shoaib Ansari</p>
            <p className="text-sm text-black/60">shoaib@gmail.com</p>
          </div>
        </div>

        <button className="flex items-center gap-2 text-sm border rounded-xl px-4 py-2 hover:bg-black hover:text-white transition">
          <Edit className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      {/* 🔹 DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="text-sm font-medium mb-4">Personal Information</h3>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-black/50" />
              <span>Shoaib Ansari</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-black/50" />
              <span>shoaib@gmail.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-black/50" />
              <span>+91 78XXXXXXX</span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h3 className="text-sm font-medium mb-4">Security</h3>

          <div className="space-y-4 text-sm">
            <button className="w-full border rounded-xl py-2 hover:bg-black hover:text-white transition">
              Change Password
            </button>

            <button className="w-full border border-red-500 text-red-500 rounded-xl py-2 hover:bg-red-500 hover:text-white transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
