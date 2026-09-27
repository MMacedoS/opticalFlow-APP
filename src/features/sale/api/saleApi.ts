import { httpClient } from "@/utils/axios";
import type {
  ApiResponse,
  Sale,
  SaleFilters,
  SaleListData,
  SalePayload,
} from "../types/sale.type";

const BASE = "/venda";

export async function getSales(
  filters: SaleFilters,
): Promise<ApiResponse<SaleListData>> {
  const response = await httpClient.get<ApiResponse<SaleListData>>(BASE, {
    params: filters,
  });
  return response.data;
}

export async function createSale(
  payload: SalePayload,
): Promise<ApiResponse<Sale>> {
  const response = await httpClient.post<ApiResponse<Sale>>(BASE, payload);
  return response.data;
}

export async function createSaleFromServiceOrder(
  ordemServicoId: string,
): Promise<ApiResponse<Sale>> {
  const response = await httpClient.post<ApiResponse<Sale>>(
    `${BASE}/ordem-servico/${ordemServicoId}`,
  );
  return response.data;
}

export async function updateSale(
  id: string,
  payload: SalePayload,
): Promise<ApiResponse<Sale>> {
  const response = await httpClient.put<ApiResponse<Sale>>(
    `${BASE}/${id}`,
    payload,
  );
  return response.data;
}

export async function finalizeSale(
  id: string,
  payload: { pago?: boolean; vencimento?: string },
): Promise<ApiResponse<Sale>> {
  const response = await httpClient.post<ApiResponse<Sale>>(
    `${BASE}/${id}/finalizar`,
    payload,
  );
  return response.data;
}

export async function cancelSale(id: string): Promise<ApiResponse<Sale>> {
  const response = await httpClient.post<ApiResponse<Sale>>(
    `${BASE}/${id}/cancelar`,
  );
  return response.data;
}

export async function deleteSale(id: string): Promise<ApiResponse<null>> {
  const response = await httpClient.delete<ApiResponse<null>>(`${BASE}/${id}`);
  return response.data;
}
