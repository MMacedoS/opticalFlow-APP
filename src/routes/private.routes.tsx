/* eslint-disable react-refresh/only-export-components -- arquivo de rotas: as páginas lazy não precisam de fast refresh aqui */
import { lazy, Suspense } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { PrivateRouteGuard } from "@/app/router/RouteGuards";
import { PageLoading } from "@/components/loading/PageLoading";

const DashboardPage = lazy(() =>
  import("@/features/dashboard").then((module) => ({
    default: module.DashboardPage,
  })),
);
const CompanyPage = lazy(() =>
  import("@/features/company").then((module) => ({
    default: module.CompanyPage,
  })),
);
const UserPage = lazy(() =>
  import("@/features/auth/user").then((module) => ({
    default: module.UserPage,
  })),
);
const BranchPage = lazy(() =>
  import("@/features/branch").then((module) => ({
    default: module.BranchPage,
  })),
);
const CustomerPage = lazy(() =>
  import("@/features/customer").then((module) => ({
    default: module.CustomerPage,
  })),
);
const AgreementPage = lazy(() =>
  import("@/features/agreement").then((module) => ({
    default: module.AgreementPage,
  })),
);
const EmployeePage = lazy(() =>
  import("@/features/employees/pages/EmployeePage").then((module) => ({
    default: module.EmployeePage,
  })),
);
const OphthalmologistPage = lazy(() =>
  import("@/features/ophthalmologist/pages/OphthalmologistPage").then(
    (module) => ({ default: module.OphthalmologistPage }),
  ),
);
const OptometristPage = lazy(() =>
  import("@/features/optometrist/pages/OptometristPage").then((module) => ({
    default: module.OptometristPage,
  })),
);
const SchedulePage = lazy(() =>
  import("@/features/schedule/pages/SchedulePage").then((module) => ({
    default: module.SchedulePage,
  })),
);
const PeoplePage = lazy(() =>
  import("@/features/people").then((module) => ({
    default: module.PeoplePage,
  })),
);
const AppointmentPage = lazy(() =>
  import("@/features/appointments").then((module) => ({
    default: module.AppointmentPage,
  })),
);
const ProductPage = lazy(() =>
  import("@/features/products").then((module) => ({
    default: module.ProductPage,
  })),
);
const LaboratoryPage = lazy(() =>
  import("@/features/laboratory").then((module) => ({
    default: module.LaboratoryPage,
  })),
);
const SupplierPage = lazy(() =>
  import("@/features/supplier").then((module) => ({
    default: module.SupplierPage,
  })),
);
const MedicalRecordListPage = lazy(() =>
  import("@/features/medical-record").then((module) => ({
    default: module.MedicalRecordListPage,
  })),
);
const MedicalRecordPage = lazy(() =>
  import("@/features/medical-record").then((module) => ({
    default: module.MedicalRecordPage,
  })),
);
const PrescriptionPrintPage = lazy(() =>
  import("@/features/prescription").then((module) => ({
    default: module.PrescriptionPrintPage,
  })),
);
const StockPage = lazy(() =>
  import("@/features/stock").then((module) => ({
    default: module.StockPage,
  })),
);
const PurchasePage = lazy(() =>
  import("@/features/purchase").then((module) => ({
    default: module.PurchasePage,
  })),
);
const SalePage = lazy(() =>
  import("@/features/sale").then((module) => ({
    default: module.SalePage,
  })),
);
const PayablePage = lazy(() =>
  import("@/features/financial").then((module) => ({
    default: module.PayablePage,
  })),
);
const ReceivablePage = lazy(() =>
  import("@/features/financial").then((module) => ({
    default: module.ReceivablePage,
  })),
);
const ServiceOrderPage = lazy(() =>
  import("@/features/service-order").then((module) => ({
    default: module.ServiceOrderPage,
  })),
);

export const privateRoutes: RouteObject[] = [
  {
    element: <PrivateRouteGuard />,
    children: [
      {
        path: "/receitas/:receitaId/imprimir",
        element: (
          <Suspense fallback={<PageLoading />}>
            <PrescriptionPrintPage />
          </Suspense>
        ),
      },
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
          {
            path: "/prontuarios",
            element: <MedicalRecordListPage />,
          },
          {
            path: "/prontuarios/atendimento/:atendimentoId",
            element: <MedicalRecordPage />,
          },
          {
            path: "/financeiro",
            element: <Navigate to="/financeiro/contas-receber" replace />,
          },
          {
            path: "/financeiro/contas-pagar",
            element: <PayablePage />,
          },
          {
            path: "/financeiro/contas-receber",
            element: <ReceivablePage />,
          },
          {
            path: "/vendas",
            element: <SalePage />,
          },
          {
            path: "/compras",
            element: <PurchasePage />,
          },
          {
            path: "/estoque",
            element: <StockPage />,
          },
          {
            path: "/fornecedores/*",
            element: <SupplierPage />,
          },
          {
            path: "/laboratorios/*",
            element: <LaboratoryPage />,
          },
        ],
      },
    ],
  },
];
