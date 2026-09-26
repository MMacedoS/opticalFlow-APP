export interface Laboratory {
  id: string;
  empresaId: string;
  nome: string;
  cnpj: string | null;
  email: string | null;
  telefone: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LaboratoryPayload {
  nome: string;
  cnpj?: string | null;
  email?: string | null;
  telefone?: string | null;
  ativo?: boolean;
}

export interface LaboratoryFilters {
  page: number;
  limit: number;
  search: string;
  ativo?: boolean;
}

export interface LaboratoriesResponse {
  status: number;
  message: string;
  data: {
    laboratorios: Laboratory[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface LaboratoryResponse {
  status: number;
  message: string;
  data?: Laboratory;
}
