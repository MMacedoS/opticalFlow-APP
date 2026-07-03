import { httpClient } from "@/utils/axios";
import type { CompanyRequest, CompanyResponse } from "../types/company.types";

export async function getCompany(
  payload: CompanyRequest,
): Promise<CompanyResponse> {
  const response = await httpClient.get<CompanyResponse>("/empresas", {
    params: payload,
  });
  return response.data;
}
