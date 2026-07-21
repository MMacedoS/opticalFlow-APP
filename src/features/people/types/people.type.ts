import type { Contato, Endereco } from "@/types/person.type";

export interface People {
  id: string;
  status: "ativo" | "inativo";
  nome: string;
  cpf: string;
  email: string;
  data_nascimento?: Date;
  contatos?: Contato[];
  enderecos?: Endereco[];
}

export interface PeopleRequest {
  search?: string;
  limit?: number;
  page?: number;
}

export interface PeopleResponse {
  status: string;
  message: string;
  data: {
    peoples: People[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface PeopleFormValues {
  id?: string;
  status: "ativo" | "inativo";
  nome: string;
  cpf: string;
  email: string;
  data_nascimento?: Date;
  enderecos?: Endereco[];
  contatos?: Contato[];
}

export interface PeopleProps {
  initialValues?: PeopleFormValues;
}
