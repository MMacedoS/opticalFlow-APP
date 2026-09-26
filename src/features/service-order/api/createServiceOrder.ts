import { httpClient } from "@/utils/axios";
import { unwrapApiResponse } from "./helpers";
import type {
  ServiceOrderCreatePayload,
  ServiceOrderDetailsResponse,
} from "../types/service-order.type";

export async function createServiceOrder(
  payload: ServiceOrderCreatePayload,
): Promise<ServiceOrderDetailsResponse> {
  const response = await httpClient.post<ServiceOrderDetailsResponse>(
    "/ordem-servico",
    payload,
  );

  return unwrapApiResponse(response.data);
}
