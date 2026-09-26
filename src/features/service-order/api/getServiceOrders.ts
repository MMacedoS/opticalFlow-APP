import { httpClient } from "@/utils/axios";
import { unwrapApiResponse } from "./helpers";
import type {
  ServiceOrderFilters,
  ServiceOrdersResponse,
} from "../types/service-order.type";

export async function getServiceOrders(
  payload: ServiceOrderFilters,
): Promise<ServiceOrdersResponse> {
  const response = await httpClient.get<ServiceOrdersResponse>("/service-orders", {
    params: payload,
  });

  return unwrapApiResponse(response.data);
}
