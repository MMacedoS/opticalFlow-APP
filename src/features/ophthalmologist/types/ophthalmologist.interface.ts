import type { Pessoa } from "@/types/person.type";

export interface Ophthalmologist {
  id: string;
  status: "ativo" | "inativo";
  registro_profissional: string;
  pessoa: Pessoa;
}

export interface OphthalmologistFormValues {
  id?: string;
  pessoa: Pessoa;
  registro_profissional: string;
  status: "ativo" | "inativo";
}

export interface OphthalmologistRequest {
  search?: string;
  limit?: number;
  page?: number;
}

export interface OphthalmologistResponse {
  status: string;
  message: string;
  data: {
    ophthalmologists: Ophthalmologist[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
export interface OphthalmologistProps {
  initialValues?: OphthalmologistFormValues;
}
