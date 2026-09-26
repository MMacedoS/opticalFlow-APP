import { httpClient } from "@/utils/axios";
import { unwrapApiResponse } from "./helpers";
import type { ServiceOrderItemMutationResponse } from "../types/service-order-item.type";

export async function deleteServiceOrderItem(
  id: string,
): Promise<ServiceOrderItemMutationResponse> {
  const response = await httpClient.delete<ServiceOrderItemMutationResponse>(
    `/ordem-servico-item/${id}`,
  );

  return unwrapApiResponse(response.data);
}
