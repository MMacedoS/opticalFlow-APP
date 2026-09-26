import { httpClient } from "@/utils/axios";
import type {
  ApiResponse,
  LimitsPayload,
  MovementPayload,
  Pagination,
  Stock,
  StockItem,
  StockItemFilters,
  StockMovement,
} from "../types/stock.type";

export async function getStocks(): Promise<ApiResponse<Stock[]>> {
  const response = await httpClient.get<ApiResponse<Stock[]>>("/estoque");
  return response.data;
}

export async function getStockItems(
  filters: StockItemFilters,
): Promise<ApiResponse<{ itens: StockItem[]; pagination: Pagination }>> {
  const response = await httpClient.get<
    ApiResponse<{ itens: StockItem[]; pagination: Pagination }>
  >("/estoque-item", { params: filters });
  return response.data;
}

export async function addStockItem(
  payload: {
    estoqueId: string;
    produtoId: string;
  } & LimitsPayload,
): Promise<ApiResponse<StockItem>> {
  const response = await httpClient.post<ApiResponse<StockItem>>(
    "/estoque-item",
    payload,
  );
  return response.data;
}

export async function updateStockLimits(
  id: string,
  payload: LimitsPayload,
): Promise<ApiResponse<StockItem>> {
  const response = await httpClient.put<ApiResponse<StockItem>>(
    `/estoque-item/${id}`,
    payload,
  );
  return response.data;
}

export async function createMovement(
  payload: MovementPayload,
): Promise<ApiResponse<StockMovement & { saldo: number }>> {
  const response = await httpClient.post<
    ApiResponse<StockMovement & { saldo: number }>
  >("/movimento-estoque", payload);
  return response.data;
}

export async function getMovements(params: {
  estoqueId: string;
  produtoId: string;
  limit: number;
}): Promise<
  ApiResponse<{ movimentos: StockMovement[]; pagination: Pagination }>
> {
  const response = await httpClient.get<
    ApiResponse<{ movimentos: StockMovement[]; pagination: Pagination }>
  >("/movimento-estoque", { params });
  return response.data;
}
