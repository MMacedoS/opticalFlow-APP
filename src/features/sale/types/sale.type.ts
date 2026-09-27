export type SaleStatus = "aberta" | "finalizada" | "cancelada";

export interface SaleItem {
  id: string;
  produtoId: string | null;
  descricao_servico: string | null;
  quantidade: number;
  valor_unitario: number;
  desconto: number | null;
  produto: { id: string; nome: string; sku: string; tipo: string } | null;
}

export interface Sale {
  id: string;
  empresaId: string;
  filialId: string;
  clienteId: string | null;
  ordemServicoId: string | null;
  dataVenda: string;
  status: SaleStatus;
  finalizadaEm: string | null;
  valor_total: number;
  observacoes: string | null;
  filial: { id: string; nome: string };
  cliente: {
    id: string;
    pessoa: { id: string; nome: string; cpf: string | null };
  } | null;
  ordem_servico: { id: string; numero: string | null; status: string } | null;
  itens: SaleItem[];
  financeiro: {
    id: string;
    valor: number;
    vencimento: string | null;
    pagoEm: string | null;
    status: string | null;
  }[];
}

export interface SaleItemPayload {
  produtoId: string | null;
  descricao_servico: string | null;
  quantidade: number;
  valor_unitario: number;
  desconto?: number;
}

export interface SalePayload {
  filialId?: string;
  clienteId?: string | null;
  dataVenda?: string;
  observacoes?: string | null;
  itens: SaleItemPayload[];
}

export interface SaleFilters {
  page: number;
  limit: number;
  search: string;
  status?: SaleStatus;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface SaleListData {
  vendas: Sale[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
