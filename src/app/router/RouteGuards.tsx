import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";

export function PrivateRouteGuard() {
  const isAuthenticated = Boolean(
    useAuthStore((state) => state.session?.accessToken),
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRouteGuard() {
  const isAuthenticated = Boolean(
    useAuthStore((state) => state.session?.accessToken),
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
