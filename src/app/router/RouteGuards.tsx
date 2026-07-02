import { Navigate, Outlet, useLocation } from "react-router-dom";

import { appNavigationItems } from "@/constants/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { hasRouteAccess } from "@/utils/authorization";

export function PrivateRouteGuard() {
  const { pathname } = useLocation();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const session = useAuthStore((state) => state.session);
  const isAuthenticated = Boolean(session?.accessToken);

  const requiredPermission = appNavigationItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  )?.requiredPermission;

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
