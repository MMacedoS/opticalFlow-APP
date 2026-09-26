import { httpClient } from "@/utils/axios";
import type { OrderFilter, OrderListResponse } from "../types/Order.type";

export async function getOrders(
  payload: OrderFilter,
): Promise<OrderListResponse> {
  const response = await httpClient.get<OrderListResponse>("/orders", {
    params: payload,
  });

  return response.data;
}
