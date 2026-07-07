import type { Company } from "@/features/company/types/company.types";
import type { Contato, Endereco, Pessoa } from "@/types/person.type";

export interface Branch {
  id: string;
  nome: string;
  cnpj: string;
  empresaId: string;
  empresa: Company;
  contatos: Contato[];
  enderecos: Endereco[];
  pessoaId: string;
  pessoa: Pessoa;
  status: "ativo" | "inativo";
  createdAt: string;
  updatedAt: string;
}

export interface BranchFormValues {
  id?: string;
  nome: string;
  cnpj: string;
  empresaId: string;
  pessoa: Pessoa;
  status: "ativo" | "inativo";
  enderecos: Endereco[];
  contatos: Contato[];
}

export interface BranchFormProps {
  initialValues?: BranchFormValues;
}

export interface BranchFormErrors {
  name?: string;
  cnpj?: string;
  empresaId?: string;
  pessoaId?: string;
}

export interface BranchRequest {
  search: string;
  limit: number;
  page: number;
}

export interface BranchResponse {
  status: string;
  message: string;
  data: {
    branches: Branch[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
