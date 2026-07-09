import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  ShoppingBasket,
  BanknoteCheck,
  ClipboardMinus,
  type LucideIcon,
  PackageSearch,
  ShoppingCart,
  UserKey,
  Building,
  HeartHandshake,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredPermission?: {
    modulo: string;
    acao: string;
  };
};

export type SidebarProjectItem = {
  label: string;
};

export const appNavigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Empresas",
    href: "/empresas",
    icon: Building2,
    requiredPermission: {
      modulo: "empresa",
      acao: "listar",
    },
  },
  {
    label: "Filiais",
    href: "/filiais",
    icon: Building,
    requiredPermission: {
      modulo: "filial",
      acao: "listar",
    },
  },
  {
    label: "Usuários",
    href: "/usuarios",
    icon: UserKey,
    requiredPermission: {
      modulo: "usuario",
      acao: "listar",
    },
  },
  {
    label: "Clientes",
    href: "/clientes",
    icon: Users,
    requiredPermission: {
      modulo: "pessoa",
      acao: "listar",
    },
  },
  {
    label: "Convênios",
    href: "/convenios",
    icon: HeartHandshake,
    requiredPermission: {
      modulo: "convenio",
      acao: "listar",
    },
  },
  {
    label: "Produtos",
    href: "/produtos",
    icon: PackageSearch,
    requiredPermission: {
      modulo: "produto",
      acao: "listar",
    },
  },
  {
    label: "Vendas",
    href: "/vendas",
    icon: ShoppingCart,
    requiredPermission: {
      modulo: "venda",
      acao: "listar",
    },
  },
  {
    label: "Compras",
    href: "/compras",
    icon: ShoppingBasket,
    requiredPermission: {
      modulo: "compra",
      acao: "listar",
    },
  },
  {
    label: "Financeiro",
    href: "/financeiro",
    icon: BanknoteCheck,
    requiredPermission: {
      modulo: "financeiro-lancamento",
      acao: "listar",
    },
  },
  {
    label: "Relatórios",
    href: "/relatorios",
    icon: ClipboardMinus,
    requiredPermission: {
      modulo: "auditoria",
      acao: "listar",
    },
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    requiredPermission: {
      modulo: "acesso",
      acao: "listar",
    },
  },
];

export const sidebarProjects: SidebarProjectItem[] = [];
