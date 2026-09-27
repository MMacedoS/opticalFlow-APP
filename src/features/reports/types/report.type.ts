export type ValueFormat = "numero" | "moeda" | "percentual" | "dias";

export interface ReportIndicator {
  label: string;
  valor: number;
  formato: ValueFormat;
}

export interface ReportGroup {
  titulo: string;
  formato: ValueFormat;
  serie?: boolean;
  itens: { label: string; valor: number; quantidade?: number }[];
}

export interface ReportColumn {
  chave: string;
  label: string;
  formato: "texto" | "data" | "dataHora" | "moeda" | "numero";
}

export interface Report {
  titulo: string;
  periodo: { inicio: string; fim: string };
  indicadores: ReportIndicator[];
  grupos: ReportGroup[];
  linhas: {
    colunas: ReportColumn[];
    itens: Record<string, string | number | null>[];
    total: number;
    truncado: boolean;
  };
}

export interface ReportFilters {
  dataInicio: string;
  dataFim: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

/** Relatorios disponiveis: rota do frontend -> endpoint e textos. */
export const REPORTS = {
  vendas: {
    endpoint: "vendas",
    title: "Relatório de vendas",
    description: "Faturamento, ticket médio, produtos e clientes.",
  },
  compras: {
    endpoint: "compras",
    title: "Relatório de compras",
    description: "Compras recebidas por fornecedor e produto.",
  },
  financeiro: {
    endpoint: "financeiro",
    title: "Relatório financeiro",
    description: "Receitas, despesas e saldo realizado pelo vencimento.",
  },
  pessoas: {
    endpoint: "pessoas",
    title: "Relatório de pessoas",
    description: "Cadastros atuais e novos cadastros no período.",
  },
  produtos: {
    endpoint: "produtos",
    title: "Relatório de produtos",
    description: "Posição de estoque e produtos mais vendidos.",
  },
  agendas: {
    endpoint: "agendas",
    title: "Relatório de agendas",
    description: "Agendamentos, faltas e cancelamentos.",
  },
  consultas: {
    endpoint: "consultas",
    title: "Relatório de consultas",
    description: "Consultas por profissional, convênio e status.",
  },
  "fluxo-ordens": {
    endpoint: "fluxo-ordens",
    title: "Relatório de fluxo de ordens",
    description: "Ordens de serviço, atrasos e prazo de entrega.",
  },
} as const;

export type ReportKey = keyof typeof REPORTS;
