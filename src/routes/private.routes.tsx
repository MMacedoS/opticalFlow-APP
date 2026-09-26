import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { PrivateRouteGuard } from "@/app/router/RouteGuards";

const DashboardPage = lazy(() =>
  import("@/features/dashboard").then((module) => ({ default: module.DashboardPage })),
);
const CompanyPage = lazy(() =>
  import("@/features/company").then((module) => ({ default: module.CompanyPage })),
);
const UserPage = lazy(() =>
  import("@/features/auth/user").then((module) => ({ default: module.UserPage })),
);
const BranchPage = lazy(() =>
  import("@/features/branch").then((module) => ({ default: module.BranchPage })),
);
const CustomerPage = lazy(() =>
  import("@/features/customer").then((module) => ({ default: module.CustomerPage })),
);
const AgreementPage = lazy(() =>
  import("@/features/agreement").then((module) => ({ default: module.AgreementPage })),
);
const EmployeePage = lazy(() =>
  import("@/features/employees/pages/EmployeePage").then((module) => ({ default: module.EmployeePage })),
);
const OphthalmologistPage = lazy(() =>
  import("@/features/ophthalmologist/pages/OphthalmologistPage").then((module) => ({ default: module.OphthalmologistPage })),
);
const OptometristPage = lazy(() =>
  import("@/features/optometrist/pages/OptometristPage").then((module) => ({ default: module.OptometristPage })),
);
const SchedulePage = lazy(() =>
  import("@/features/schedule/pages/SchedulePage").then((module) => ({ default: module.SchedulePage })),
);
const PeoplePage = lazy(() =>
  import("@/features/people").then((module) => ({ default: module.PeoplePage })),
);
const AppointmentPage = lazy(() =>
  import("@/features/appointments").then((module) => ({ default: module.AppointmentPage })),
);
const ProductPage = lazy(() =>
  import("@/features/products").then((module) => ({ default: module.ProductPage })),
);
const ServiceOrderPage = lazy(() =>
  import("@/features/service-order").then((module) => ({ default: module.ServiceOrderPage })),
);

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
          {
            path: "/ordens-servico/*",
            element: <ServiceOrderPage />,
          },
        ],
      },
    ],
  },
];
