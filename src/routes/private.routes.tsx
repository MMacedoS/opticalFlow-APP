import type { RouteObject } from "react-router-dom";

import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { PrivateRouteGuard } from "@/app/router/RouteGuards";
import { DashboardPage } from "@/features/dashboard";
import { CompanyPage } from "@/features/company";
import { UserPage } from "@/features/auth/user";
import { BranchPage } from "@/features/branch";
import { CustomerPage } from "@/features/customer";
import { AgreementPage } from "@/features/agreement";
import { EmployeePage } from "@/features/employees/pages/EmployeePage";
import { OphthalmologistPage } from "@/features/ophthalmologist/pages/OphthalmologistPage";
import { OptometristPage } from "@/features/optometrist/pages/OptometristPage";
import { SchedulePage } from "@/features/schedule/pages/SchedulePage";
import { PeoplePage } from "@/features/people";
import { AppointmentPage } from "@/features/appointments";
import { ProductPage } from "@/features/products";

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
            path: "/convenios/*",
            element: <AgreementPage />,
          },
          {
            path: "/clientes/*",
            element: <CustomerPage />,
          },
          {
            path: "/usuarios/*",
            element: <UserPage />,
          },
          {
            path: "/funcionarios/*",
            element: <EmployeePage />,
          },
          {
            path: "/oftalmologistas/*",
            element: <OphthalmologistPage />,
          },
          {
            path: "/optometristas/*",
            element: <OptometristPage />,
          },
          {
            path: "/agendas/*",
            element: <SchedulePage />,
          },
          {
            path: "/pessoas",
            element: <PeoplePage />,
          },
          {
            path: "/consultas",
            element: <AppointmentPage />,
          },
          {
            path: "/produtos/*",
            element: <ProductPage />,
          },
        ],
      },
    ],
  },
];
