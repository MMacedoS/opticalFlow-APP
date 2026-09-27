export type AppointmentStatus =
  "em_espera" | "em_andamento" | "concluido" | "cancelado";

export interface DashboardSections {
  consultasHoje: {
    total: number;
    porStatus: Record<AppointmentStatus, number>;
    proximas: {
      id: string;
      dataAtendimento: string;
      status: AppointmentStatus;
      paciente: string;
      profissional: string | null;
    }[];
  };
  ordensServico: {
    abertas: number;
    atrasadas: number;
    listaAtrasadas: {
      id: string;
      numero: string | null;
      previsao_entrega: string | null;
      cliente: string | null;
      valor_total: number;
    }[];
  };
  vendas: {
    mesAtual: { total: number; quantidade: number };
    mesAnterior: { total: number; quantidade: number };
  };
  financeiro: {
    receberVencido: number;
    pagarVencido: number;
    receberProximos7Dias: number;
    pagarProximos7Dias: number;
  };
  estoque: {
    abaixoMinimo: number;
    itens: {
      id: string;
      produto: string;
      sku: string;
      quantidade: number;
      minimo: number | null;
    }[];
  };
}

/** Secoes que o usuario nao pode ver chegam como null. */
export type DashboardSummary = {
  [K in keyof DashboardSections]: DashboardSections[K] | null;
};
