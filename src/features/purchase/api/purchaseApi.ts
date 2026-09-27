import { httpClient } from "@/utils/axios";
import type {
  ApiResponse,
  Purchase,
  PurchaseFilters,
  PurchaseListData,
  PurchasePayload,
} from "../types/purchase.type";

const BASE = "/compra";

export async function getPurchases(
  filters: PurchaseFilters,
): Promise<ApiResponse<PurchaseListData>> {
  const response = await httpClient.get<ApiResponse<PurchaseListData>>(BASE, {
    params: filters,
  });
  return response.data;
}

export async function createPurchase(
  payload: PurchasePayload,
): Promise<ApiResponse<Purchase>> {
  const response = await httpClient.post<ApiResponse<Purchase>>(BASE, payload);
  return response.data;
}

export async function updatePurchase(
  id: string,
  payload: PurchasePayload,
): Promise<ApiResponse<Purchase>> {
  const response = await httpClient.put<ApiResponse<Purchase>>(
    `${BASE}/${id}`,
    payload,
  );
  return response.data;
}

export async function receivePurchase(
  id: string,
  vencimento?: string,
): Promise<ApiResponse<Purchase>> {
  const response = await httpClient.post<ApiResponse<Purchase>>(
    `${BASE}/${id}/receber`,
    { vencimento },
  );
  return response.data;
}

export async function cancelPurchase(
  id: string,
): Promise<ApiResponse<Purchase>> {
  const response = await httpClient.post<ApiResponse<Purchase>>(
    `${BASE}/${id}/cancelar`,
  );
  return response.data;
}

export async function deletePurchase(id: string): Promise<ApiResponse<null>> {
  const response = await httpClient.delete<ApiResponse<null>>(`${BASE}/${id}`);
  return response.data;
}
