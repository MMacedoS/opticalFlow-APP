export type ProductType = "armacao" | "lente" | "acessorio" | "servico";
export type MovementType = "entrada" | "saida" | "ajuste";

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface Stock {
  id: string;
  empresaId: string;
  filialId: string;
  nome: string | null;
  filial: { id: string; nome: string };
  _count: { itens: number };
  abaixoMinimo: number;
}

export interface StockItem {
  id: string;
  estoqueId: string;
  produtoId: string;
  quantidade: number;
  minimo: number | null;
  maximo: number | null;
  updatedAt: string;
  produto: {
    id: string;
    nome: string;
    sku: string;
    tipo: ProductType;
    categoria: string | null;
    preco_venda: number;
    ativo: "ativo" | "inativo";
  };
}

export interface StockMovement {
  id: string;
  tipo: MovementType;
  quantidade: number;
  motivo: string | null;
  referencia: string | null;
  createdAt: string;
  produto: { id: string; nome: string; sku: string };
}

export interface StockItemFilters {
  page: number;
  limit: number;
  search: string;
  estoqueId?: string;
  tipo?: ProductType;
  abaixoMinimo?: boolean;
}

export interface MovementPayload {
  estoqueId: string;
  produtoId: string;
  tipo: MovementType;
  quantidade: number;
  motivo?: string;
  referencia?: string;
}

export interface LimitsPayload {
  minimo: number | null;
  maximo: number | null;
}
