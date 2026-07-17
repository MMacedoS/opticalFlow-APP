import type { Pessoa } from "@/types/person.type";

export interface Optometrist {
  id: string;
  status: "ativo" | "inativo";
  registro_profissional: string;
  pessoa: Pessoa;
}

export interface OptometristFormValues {
  id?: string;
  pessoa: Pessoa;
  registro_profissional: string;
  status: "ativo" | "inativo";
}

export interface OptometristRequest {
  search?: string;
  limit?: number;
  page?: number;
}

export interface OptometristResponse {
  status: string;
  message: string;
  data: {
    optometrists: Optometrist[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
export interface OptometristProps {
  initialValues?: OptometristFormValues;
}
