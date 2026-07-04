import { NavLink, useLocation } from "react-router-dom";

import { appNavigationItems } from "@/constants/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/layouts/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/app/layouts/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth.store";
import { hasRouteAccess } from "@/utils/authorization";
import type { LucideIcon } from "lucide-react";

export function SidebarItemIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-5 items-center justify-center rounded-md bg-sidebar-foreground/10 text-[10px] font-semibold text-sidebar-foreground">
      <Icon className="size-3.5" />
    </span>
  );
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  const allowedNavigationItems = appNavigationItems.filter((item) =>
    hasRouteAccess(session, item.requiredPermission),
  );

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="border-r border-border/70 bg-sidebar shadow-sm backdrop-blur sm:*:max-w-80 sm:*:min-w-15"
    >
      <SidebarHeader className="gap-3 p-3 group-data-[collapsible=icon]:p-2 ">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-sidebar-accent"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
            <span className="text-xs font-semibold">A</span>
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              Acme Inc
            </p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              Enterprise
            </p>
          </div>
        </button>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-2 sm:*:max-w-80 sm:*:min-w-40">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-[0.16em] text-sidebar-foreground/60">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allowedNavigationItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      className="rounded-xl"
                      render={<NavLink to={item.href} />}
                    >
                      <SidebarItemIcon icon={item.icon} />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* {["Models", "Documentation", "Settings"].map((item) => (
                <SidebarMenuItem key={item}>
                  <SidebarMenuButton tooltip={item} className="rounded-xl">
                    <SidebarItemIcon label={item} />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item}
                    </span>
                    <span className="ml-auto text-xs text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
                      &gt;
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))} */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />
      </SidebarContent>

      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-sidebar-accent"
              />
            }
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,oklch(0.74_0.23_345),oklch(0.71_0.18_290))] text-[11px] font-semibold text-white">
              SH
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                shadcn
              </p>
              <p className="truncate text-xs text-sidebar-foreground/70">
                m@example.com
              </p>
            </div>
            <span className="ml-auto text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
              &gt;
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Preferencias</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={clearSession}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
