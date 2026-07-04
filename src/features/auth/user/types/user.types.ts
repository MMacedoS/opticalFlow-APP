import type { Company } from "@/features/company/types/company.types";

export interface User {
  id?: string;
  username: string;
  email: string;
  empresa_id?: string;
  empresa?: Company;
  status: "ativo" | "inativo";
}

export interface UserRequest {
  search: string;
  limit: number;
  page: number;
}

export interface UserResponse {
  status: number;
  message: string;
  data: {
    users: User[];
    pagination: {
      total: number;
      limit: number;
      page: number;
      pages: number;
    };
  };
}

export interface UserFormValues {
  id?: string;
  username: string;
  email: string;
  senha?: string | undefined;
  status: "ativo" | "inativo";
}
