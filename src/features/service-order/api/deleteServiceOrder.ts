import { httpClient } from "@/utils/axios";
import { unwrapApiResponse } from "./helpers";
import type { ServiceOrderMutationResponse } from "../types/service-order.type";

export async function deleteServiceOrder(
  serviceOrderId: string,
): Promise<ServiceOrderMutationResponse> {
  const response = await httpClient.delete<ServiceOrderMutationResponse>(
    `/service-orders/${serviceOrderId}`,
  );

  return unwrapApiResponse(response.data);
}
