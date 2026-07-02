export type NavigationItem = {
  label: string;
  href: string;
  icon?: string;
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
    icon: "dashboard",
  },
  {
    label: "Empresas",
    href: "/empresas",
    requiredPermission: {
      modulo: "empresa",
      acao: "listar",
    },
  },
  {
    label: "Clientes",
    href: "/clientes",
    requiredPermission: {
      modulo: "pessoa",
      acao: "listar",
    },
  },
  {
    label: "Produtos",
    href: "/produtos",
    requiredPermission: {
      modulo: "produto",
      acao: "listar",
    },
  },
  {
    label: "Vendas",
    href: "/vendas",
    requiredPermission: {
      modulo: "venda",
      acao: "listar",
    },
  },
  {
    label: "Compras",
    href: "/compras",
    requiredPermission: {
      modulo: "compra",
      acao: "listar",
    },
  },
  {
    label: "Financeiro",
    href: "/financeiro",
    requiredPermission: {
      modulo: "financeiro-lancamento",
      acao: "listar",
    },
  },
  {
    label: "Relatórios",
    href: "/relatorios",
    requiredPermission: {
      modulo: "auditoria",
      acao: "listar",
    },
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    requiredPermission: {
      modulo: "acesso",
      acao: "listar",
    },
  },
];

export const sidebarProjects: SidebarProjectItem[] = [];
