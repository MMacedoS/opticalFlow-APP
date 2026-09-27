import { httpClient } from "@/utils/axios";
import type {
  ApiResponse,
  FinancialEntry,
  FinancialEntryPayload,
  FinancialFilters,
  FinancialListData,
  PaymentMethod,
} from "../types/financial.type";

const BASE = "/financeiro-lancamento";

export async function getFinancialEntries(
  filters: FinancialFilters,
): Promise<ApiResponse<FinancialListData>> {
  const response = await httpClient.get<ApiResponse<FinancialListData>>(BASE, {
    params: filters,
  });
  return response.data;
}

export async function saveFinancialEntry(
  payload: FinancialEntryPayload,
  id?: string,
): Promise<ApiResponse<FinancialEntry>> {
  const response = id
    ? await httpClient.put<ApiResponse<FinancialEntry>>(
        `${BASE}/${id}`,
        payload,
      )
    : await httpClient.post<ApiResponse<FinancialEntry>>(BASE, payload);
  return response.data;
}

export async function settleFinancialEntry(
  id: string,
  payload: { pagoEm?: string; forma_pagamento: PaymentMethod },
): Promise<ApiResponse<FinancialEntry>> {
  const response = await httpClient.post<ApiResponse<FinancialEntry>>(
    `${BASE}/${id}/baixar`,
    payload,
  );
  return response.data;
}

export async function reverseFinancialEntry(
  id: string,
): Promise<ApiResponse<FinancialEntry>> {
  const response = await httpClient.post<ApiResponse<FinancialEntry>>(
    `${BASE}/${id}/estornar`,
  );
  return response.data;
}

export async function cancelFinancialEntry(
  id: string,
): Promise<ApiResponse<FinancialEntry>> {
  const response = await httpClient.post<ApiResponse<FinancialEntry>>(
    `${BASE}/${id}/cancelar`,
  );
  return response.data;
}

export async function deleteFinancialEntry(
  id: string,
): Promise<ApiResponse<null>> {
  const response = await httpClient.delete<ApiResponse<null>>(`${BASE}/${id}`);
  return response.data;
}
