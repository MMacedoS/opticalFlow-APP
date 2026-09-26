import { httpClient } from "@/utils/axios";
import { unwrapApiResponse } from "./helpers";
import type {
  ServiceOrderDetailsResponse,
  ServiceOrderUpdatePayload,
} from "../types/service-order.type";

export async function updateServiceOrder(
  id: string,
  payload: ServiceOrderUpdatePayload,
): Promise<ServiceOrderDetailsResponse> {
  const response = await httpClient.put<ServiceOrderDetailsResponse>(
    `/service-orders/${id}`,
    payload,
  );

  return unwrapApiResponse(response.data);
}
