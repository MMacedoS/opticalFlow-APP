import { httpClient } from "@/utils/axios";
import type {
  CompanyFormValues,
  CompanyResponse,
} from "../types/company.types";

export async function updateCompany(
  payload: CompanyFormValues,
): Promise<CompanyResponse> {
  const id = payload.id;
  if (!id) {
    throw new Error("ID da empresa não fornecido.");
  }
  return httpClient
    .put<CompanyResponse>(`/empresas/${id}`, payload)
    .then((response) => response.data);
}
