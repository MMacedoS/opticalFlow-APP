import type { RouteObject } from "react-router-dom";

import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { PrivateRouteGuard } from "@/app/router/RouteGuards";
import { DashboardPage } from "@/features/dashboard";

export const privateRoutes: RouteObject[] = [
  {
    element: <PrivateRouteGuard />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
];
