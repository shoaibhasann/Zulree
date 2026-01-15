import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/admin/AppSidebar";

import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-theme min-h-screen bg-admin-bg text-admin-text">
      <SidebarProvider>
        <AppSidebar />

        <main className="flex-1 bg-admin-bg text-admin-text">
          <div className="p-2 border-b ">
            <SidebarTrigger
              className="
                        h-9 w-9
                        rounded-lg
                        bg-admin-card
                        border border-admin-border
                        text-white
                        hover:bg-[#151a34]
                        hover:text-white
                        transition-colors
                      "
            />
          </div>

          <div className="p-6 bg-admin-bg text-admin-text">
            {children}
            {/* 🔔 Toast Container */}
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#111827", // slate-900
                  color: "#fff",
                },
                success: {
                  iconTheme: {
                    primary: "#22c55e", // green
                    secondary: "#000",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444", // red
                    secondary: "#000",
                  },
                },
              }}
            />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
