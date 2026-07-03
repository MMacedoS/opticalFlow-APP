import { httpClient } from "@/utils/axios";
import type {
  CompanyFormValues,
  CompanyResponse,
} from "../types/company.types";

export async function createCompany(
  payload: CompanyFormValues,
): Promise<CompanyResponse> {
  const response = await httpClient.post<CompanyResponse>("/empresas", payload);
  return response.data;
}
