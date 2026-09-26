import { httpClient } from "@/utils/axios";
import type { OrderFormValues, OrderListResponse } from "../types/Order.type";

export async function CreateOrder(
  payload: OrderFormValues,
): Promise<OrderListResponse> {
  const response = await httpClient.post<OrderListResponse>("/orders", payload);
  return response.data;
}
