import { httpClient } from "@/utils/axios";
import type {
  SuppliersResponse,
  SupplierFilters,
  SupplierPayload,
  SupplierResponse,
} from "../types/supplier.type";

export async function getSuppliers(
  filters: SupplierFilters,
): Promise<SuppliersResponse> {
  const response = await httpClient.get<SuppliersResponse>("/fornecedor", {
    params: filters,
  });
  return response.data;
}

export async function createSupplier(
  payload: SupplierPayload,
): Promise<SupplierResponse> {
  const response = await httpClient.post<SupplierResponse>(
    "/fornecedor",
    payload,
  );
  return response.data;
}

export async function updateSupplier(
  id: string,
  payload: Partial<SupplierPayload>,
): Promise<SupplierResponse> {
  const response = await httpClient.put<SupplierResponse>(
    `/fornecedor/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteSupplier(id: string): Promise<SupplierResponse> {
  const response = await httpClient.delete<SupplierResponse>(
    `/fornecedor/${id}`,
  );
  return response.data;
}
