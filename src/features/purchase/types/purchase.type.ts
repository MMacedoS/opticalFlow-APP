export type PurchaseStatus = "rascunho" | "recebida" | "cancelada";

export interface PurchaseItem {
  id: string;
  produtoId: string;
  quantidade: number;
  valor_unitario: number;
  desconto: number | null;
  produto: { id: string; nome: string; sku: string; tipo: string };
}

export interface Purchase {
  id: string;
  empresaId: string;
  filialId: string;
  fornecedorId: string | null;
  dataCompra: string;
  status: PurchaseStatus;
  recebidaEm: string | null;
  valor_total: number;
  observacoes: string | null;
  filial: { id: string; nome: string };
  fornecedor: {
    id: string;
    razao_social: string;
    nome_fantasia: string | null;
    cnpj: string | null;
  } | null;
  itens: PurchaseItem[];
  financeiro: {
    id: string;
    valor: number;
    vencimento: string | null;
    pagoEm: string | null;
    status: string | null;
  }[];
}

export interface PurchaseItemPayload {
  produtoId: string;
  quantidade: number;
  valor_unitario: number;
  desconto?: number;
}

export interface PurchasePayload {
  filialId?: string;
  fornecedorId?: string | null;
  dataCompra?: string;
  observacoes?: string | null;
  itens: PurchaseItemPayload[];
}

export interface PurchaseFilters {
  page: number;
  limit: number;
  search: string;
  status?: PurchaseStatus;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PurchaseListData {
  compras: Purchase[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
