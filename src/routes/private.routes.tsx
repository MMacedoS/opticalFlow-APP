import type { RouteObject } from "react-router-dom";

import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { PrivateRouteGuard } from "@/app/router/RouteGuards";
import { DashboardPage } from "@/features/dashboard";
import { CompanyPage } from "@/features/company";
import { UserPage } from "@/features/auth/user";
import { BranchPage } from "@/features/branch";

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
          {
            path: "/empresas/*",
            element: <CompanyPage />,
          },
          {
            path: "/filiais/*",
            element: <BranchPage />,
          },
          {
            path: "/usuarios/*",
            element: <UserPage />,
          },
        ],
      },
    ],
  },
];
