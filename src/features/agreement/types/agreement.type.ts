import type { Company } from "@/features/company/types/company.types";

export interface Agreement {
  id: string;
  empresa: Company;
  nome: string;
  registro: string;
  ativo: "ativo" | "inativo";
}

export interface AgreementFormValues {
  id?: string;
  nome: string;
  registro: string;
  ativo: "ativo" | "inativo";
}

export interface AgreementProps {
  initialValues?: AgreementFormValues;
}

export interface AgreementResponse {
  status: string;
  message: string;
  data: {
    agreements: Agreement[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface AgreementRequest {
  search?: string;
  limit?: number;
  page?: number;
}
