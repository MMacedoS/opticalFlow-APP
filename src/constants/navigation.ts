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
  HatGlasses,
  EyeDashed,
  PersonStandingIcon,
  PlusCircle,
  Calendar,
  Stethoscope,
  Activity,
  ClockArrowDown,
  ArrowLeftRight,
  UnfoldHorizontal,
  FoldHorizontal,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredPermission?: {
    modulo: string;
    acao: string;
  };
  children?: NavigationItem[];
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
    label: "Cadastro de Pessoas",
    href: "#",
    icon: PlusCircle,
    requiredPermission: {
      modulo: "pessoa",
      acao: "listar",
    },
    children: [
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
        label: "Funcionários",
        href: "/funcionarios",
        icon: Users,
        requiredPermission: {
          modulo: "funcionario",
          acao: "listar",
        },
      },
      {
        label: "Oftalmologistas",
        href: "/oftalmologistas",
        icon: HatGlasses,
        requiredPermission: {
          modulo: "oftalmologista",
          acao: "listar",
        },
      },
      {
        label: "Optometristas",
        href: "/optometristas",
        icon: EyeDashed,
        requiredPermission: {
          modulo: "optometrista",
          acao: "listar",
        },
      },
      {
        label: "Pessoas",
        href: "/pessoas",
        icon: PersonStandingIcon,
        requiredPermission: {
          modulo: "pessoa",
          acao: "listar",
        },
      },
    ],
  },
  {
    label: "Ger. de Produtos",
    href: "#",
    icon: PackageSearch,
    children: [
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
        label: "Estoque",
        href: "/estoque",
        icon: ArrowLeftRight,
        requiredPermission: {
          modulo: "estoque",
          acao: "listar",
        },
      },
    ],
  },
  {
    label: "Agendas",
    href: "/agendas",
    icon: Calendar,
    requiredPermission: {
      modulo: "agenda",
      acao: "listar",
    },
  },
  {
    label: "Consultas",
    href: "/consultas",
    icon: Stethoscope,
    requiredPermission: {
      modulo: "atendimento",
      acao: "listar",
    },
  },
  {
    label: "Fluxo de Ordens",
    href: "#",
    icon: Activity,
    children: [
      {
        label: "Ordens de Serviço",
        href: "/ordens-servico",
        icon: ClockArrowDown,
        requiredPermission: {
          modulo: "ordem-servico",
          acao: "listar",
        },
      },
    ],
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
    children: [
      {
        label: "Contas a Pagar",
        href: "/financeiro/contas-pagar",
        icon: UnfoldHorizontal,
        requiredPermission: {
          modulo: "financeiro-lancamento",
          acao: "listar",
        },
      },
      {
        label: "Contas a Receber",
        href: "/financeiro/contas-receber",
        icon: FoldHorizontal,
        requiredPermission: {
          modulo: "financeiro-lancamento",
          acao: "listar",
        },
      },
    ],
  },
  {
    label: "Relatórios",
    href: "#",
    icon: ClipboardMinus,
    requiredPermission: {
      modulo: "auditoria",
      acao: "listar",
    },
    children: [
      {
        label: "Vendas",
        href: "/relatorios/vendas",
        icon: ShoppingCart,
        requiredPermission: {
          modulo: "venda",
          acao: "listar",
        },
      },
      {
        label: "Compras",
        href: "/relatorios/compras",
        icon: ShoppingBasket,
        requiredPermission: {
          modulo: "compra",
          acao: "listar",
        },
      },
      {
        label: "Financeiro",
        href: "/relatorios/financeiro",
        icon: BanknoteCheck,
        requiredPermission: {
          modulo: "financeiro-lancamento",
          acao: "listar",
        },
      },
      {
        label: "Pessoas",
        href: "/relatorios/pessoas",
        icon: Users,
        requiredPermission: {
          modulo: "pessoa",
          acao: "listar",
        },
      },
      {
        label: "Produtos",
        href: "/relatorios/produtos",
        icon: PackageSearch,
        requiredPermission: {
          modulo: "produto",
          acao: "listar",
        },
      },
      {
        label: "Agendas",
        href: "/relatorios/agendas",
        icon: Calendar,
        requiredPermission: {
          modulo: "agenda",
          acao: "listar",
        },
      },
      {
        label: "Consultas",
        href: "/relatorios/consultas",
        icon: Stethoscope,
        requiredPermission: {
          modulo: "atendimento",
          acao: "listar",
        },
      },
      {
        label: "Fluxo de Ordens",
        href: "/relatorios/fluxo-ordens",
        icon: Activity,
        requiredPermission: {
          modulo: "ordem-servico",
          acao: "listar",
        },
      },
      {
        label: "Auditoria",
        href: "/auditoria",
        icon: ClipboardMinus,
        requiredPermission: {
          modulo: "auditoria",
          acao: "listar",
        },
      },
    ],
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    requiredPermission: {
      modulo: "acesso",
      acao: "listar",
    },
    children: [
      {
        label: "Usuários",
        href: "/usuarios",
        icon: UserKey,
        requiredPermission: {
          modulo: "usuario",
          acao: "listar",
        },
      },
    ],
  },
];

export const sidebarProjects: SidebarProjectItem[] = [];
