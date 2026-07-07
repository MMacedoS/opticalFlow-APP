import type { Contato, Endereco } from "@/types/person.type";

export interface Company {
  id?: string;
  nome: string;
  razao: string;
  email: string;
  cnpj: string;
  registro_municipal?: string;
  registro_estadual?: string;
  website?: string;
  status: "ativo" | "inativo";
  enderecos: Endereco[];
  contatos: Contato[];
}

export interface CompanyRequest {
  search: string;
  limit: number;
  page: number;
}

export interface CompanyResponse {
  status: number;
  message: string;
  data: {
    companies: Company[];
    pagination: {
      total: number;
      limit: number;
      page: number;
      pages: number;
    };
  };
}

export interface CompanyFormValues {
  id?: string;
  nome: string;
  razao: string;
  email: string;
  cnpj: string;
  registro_estadual?: string;
  registro_municipal?: string;
  website?: string;
  status: "ativo" | "inativo";
  enderecos: Endereco[];
  contatos: Contato[];
}
