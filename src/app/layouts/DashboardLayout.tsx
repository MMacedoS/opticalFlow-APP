import { Outlet } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
} from "@/app/layouts/components/ui/sidebar";
import { AppFooter } from "./components/AppFooter";
import { AppHeader } from "./components/AppHeader";
import { AppSidebar } from "./components/AppSidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="min-h-svh bg-[radial-gradient(circle_at_10%_10%,oklch(0.97_0.01_250)_0%,transparent_35%),radial-gradient(circle_at_90%_0%,oklch(0.96_0.02_190)_0%,transparent_40%),linear-gradient(165deg,oklch(0.995_0_0)_0%,oklch(0.98_0.01_250)_100%)]">
        <div className="flex min-h-svh w-full flex-col gap-4 p-4 md:gap-6 md:p-6">
          <AppHeader />
          <section className="flex-1">
            <Outlet />
          </section>
          <AppFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
