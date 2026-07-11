import type { Contato, Endereco, Pessoa } from "@/types/person.type";

export interface Customer {
  id: string;
  status: "ativo" | "inativo";
  pessoa: Pessoa;
  contatos?: Contato[];
  enderecos?: Endereco[];
}

export interface CustomerRequest {
  search?: string;
  limit?: number;
  page?: number;
}

export interface CustomerResponse {
  status: string;
  message: string;
  data: {
    customers: Customer[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface CustomerFormValues {
  id?: string;
  status: "ativo" | "inativo";
  pessoa: Pessoa;
  endereco?: Endereco[];
  contato?: Contato[];
}

export interface CustomerProps {
  initialValues?: CustomerFormValues;
}
