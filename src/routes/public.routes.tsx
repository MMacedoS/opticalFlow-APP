import type { RouteObject } from "react-router-dom";

import { AuthLayout } from "@/app/layouts/AuthLayout";
import { PublicOnlyRouteGuard } from "@/app/router/RouteGuards";
import { LoginPage } from "@/features/auth/login";

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicOnlyRouteGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
];
