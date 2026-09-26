export interface Supplier {
  id: string;
  empresaId: string;
  razao_social: string;
  nome_fantasia: string | null;
  cnpj: string | null;
  email: string | null;
  telefone: string | null;
  observacoes: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierPayload {
  razao_social: string;
  nome_fantasia?: string | null;
  cnpj?: string | null;
  email?: string | null;
  telefone?: string | null;
  observacoes?: string | null;
  ativo?: boolean;
}

export interface SupplierFilters {
  page: number;
  limit: number;
  search: string;
  ativo?: boolean;
}

export interface SuppliersResponse {
  status: number;
  message: string;
  data: {
    fornecedores: Supplier[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface SupplierResponse {
  status: number;
  message: string;
  data?: Supplier;
}
