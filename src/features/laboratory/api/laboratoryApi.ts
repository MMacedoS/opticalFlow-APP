import { httpClient } from "@/utils/axios";
import type {
  LaboratoriesResponse,
  LaboratoryFilters,
  LaboratoryPayload,
  LaboratoryResponse,
} from "../types/laboratory.type";

export async function getLaboratories(
  filters: LaboratoryFilters,
): Promise<LaboratoriesResponse> {
  const response = await httpClient.get<LaboratoriesResponse>("/laboratorio", {
    params: filters,
  });
  return response.data;
}

export async function createLaboratory(
  payload: LaboratoryPayload,
): Promise<LaboratoryResponse> {
  const response = await httpClient.post<LaboratoryResponse>(
    "/laboratorio",
    payload,
  );
  return response.data;
}

export async function updateLaboratory(
  id: string,
  payload: Partial<LaboratoryPayload>,
): Promise<LaboratoryResponse> {
  const response = await httpClient.put<LaboratoryResponse>(
    `/laboratorio/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteLaboratory(
  id: string,
): Promise<LaboratoryResponse> {
  const response = await httpClient.delete<LaboratoryResponse>(
    `/laboratorio/${id}`,
  );
  return response.data;
}
