import type { Pessoa } from "@/types/person.type";

export interface Employee {
  id: string;
  cargo: string;
  status: "ativo" | "inativo";
  pessoa: Pessoa;
}

export interface EmployeeFormValues {
  id?: string;
  cargo: string;
  pessoa: Pessoa;
  status: "ativo" | "inativo";
}

export interface EmployeeRequest {
  search?: string;
  limit?: number;
  page?: number;
}

export interface EmployeeResponse {
  status: string;
  message: string;
  data: {
    employees: Employee[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
export interface EmployeeProps {
  initialValues?: EmployeeFormValues;
}
