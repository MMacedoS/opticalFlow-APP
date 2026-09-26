import { httpClient } from "@/utils/axios";
import { unwrapApiResponse } from "./helpers";
import type {
  ServiceOrderFilters,
  ServiceOrdersResponse,
} from "../types/service-order.type";

export async function getServiceOrders(
  payload: ServiceOrderFilters,
): Promise<ServiceOrdersResponse> {
  const response = await httpClient.get<ServiceOrdersResponse>("/ordem-servico", {
    params: payload,
  });

  return unwrapApiResponse(response.data);
}
