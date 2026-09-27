export type FinancialType = "receita" | "despesa";
export type FinancialStatus = "pendente" | "pago" | "cancelado";
export type PaymentMethod =
  | "dinheiro"
  | "pix"
  | "cartao_credito"
  | "cartao_debito"
  | "boleto"
  | "transferencia";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "Pix" },
  { value: "cartao_credito", label: "Cartão de crédito" },
  { value: "cartao_debito", label: "Cartão de débito" },
  { value: "boleto", label: "Boleto" },
  { value: "transferencia", label: "Transferência" },
];

export interface FinancialEntry {
  id: string;
  tipo: FinancialType;
  categoria: string | null;
  descricao: string | null;
  valor: number;
  vencimento: string | null;
  pagoEm: string | null;
  status: FinancialStatus;
  forma_pagamento: PaymentMethod | null;
  compraId: string | null;
  vendaId: string | null;
  createdAt: string;
  filial: { id: string; nome: string } | null;
  criado_por: { id: string; username: string | null } | null;
  compra: {
    id: string;
    fornecedor: { razao_social: string; nome_fantasia: string | null } | null;
  } | null;
  venda: {
    id: string;
    cliente: { pessoa: { nome: string } } | null;
  } | null;
}

export interface FinancialTotals {
  pendente: number;
  vencido: number;
  pago: number;
}

export interface FinancialFilters {
  page: number;
  limit: number;
  search: string;
  tipo: FinancialType;
  status?: FinancialStatus;
  vencidos?: boolean;
  dataInicio?: string;
  dataFim?: string;
}

export interface FinancialEntryPayload {
  tipo?: FinancialType;
  categoria?: string | null;
  descricao?: string | null;
  valor?: number;
  vencimento?: string | null;
  pago?: boolean;
  forma_pagamento?: PaymentMethod;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface FinancialListData {
  lancamentos: FinancialEntry[];
  totais: FinancialTotals;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
