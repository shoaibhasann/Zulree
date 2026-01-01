
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

export default function AdminLayout({ children }) {

  return (
    <div className="dark min-h-screen">
      <SidebarProvider>
        <AppSidebar />

        <main className="flex-1 bg-[#0a0a0a] text-white">
          <div className="p-2 border-b ">
            <SidebarTrigger />
          </div>

          <div className="p-6">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
