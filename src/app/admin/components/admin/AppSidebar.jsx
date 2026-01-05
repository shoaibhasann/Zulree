"use client";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut,
  Truck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useRouter, usePathname } from "next/navigation";
import api from "@/app/lib/api";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Inventory",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Customers",
    url: "/admin/customers",
    icon: Users,
  },
  {
    title: "Shipments",
    url: "/admin/shipments",
    icon: Truck,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const { data } = await api.post("/api/v1/auth/logout");
      if (data.success) {
        router.replace("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-admin-foreground border-r border-admin-border">
        {/* BRAND */}
        <div className="px-4 text-white py-3 text-lg font-bold tracking-wide">
          Zulree Admin
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">
            Management
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                /**
                 * ✅ ACTIVE LOGIC (BUG-FREE)
                 * - Dashboard (/admin) → exact match only
                 * - Others → exact or child routes
                 */
                const isActive =
                  item.url === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.url ||
                      pathname.startsWith(item.url + "/");

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        flex items-center gap-3 hover:bg-admin-primary hover:text-white
                        ${
                          isActive
                            ? "bg-admin-primary text-white"
                            : "text-white"
                        }
                      `}
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={`h-4 w-4 ${
                            isActive ? "text-green-400" : "text-slate-400"
                          }`}
                        />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* LOGOUT */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="hover:bg-red-900 hover:text-white cursor-pointer text-red-400 flex items-center gap-3"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
