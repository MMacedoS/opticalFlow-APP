import { Navigate, Outlet, useLocation } from "react-router-dom";

import { appNavigationItems } from "@/constants/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { hasRouteAccess } from "@/utils/authorization";

export function PrivateRouteGuard() {
  const { pathname } = useLocation();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const session = useAuthStore((state) => state.session);
  const isAuthenticated = Boolean(session?.accessToken);

  // Item de menu mais especifico (inclui submenus) que corresponde a rota.
  const requiredPermission = appNavigationItems
    .flatMap((item) => [item, ...(item.children ?? [])])
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.requiredPermission;

  if (!hasHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRouteAccess(session, requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRouteGuard() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = Boolean(
    useAuthStore((state) => state.session?.accessToken),
  );

  if (!hasHydrated) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
