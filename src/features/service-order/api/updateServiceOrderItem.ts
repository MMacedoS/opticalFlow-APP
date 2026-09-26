import { httpClient } from "@/utils/axios";
import { unwrapApiResponse } from "./helpers";
import type { ServiceOrderItemMutationResponse } from "../types/service-order-item.type";

export async function updateServiceOrderItem(
  id: string,
  payload: {
    descricao_servico?: string;
    quantidade?: number;
    valor_unitario?: number;
    desconto?: number;
  },
): Promise<ServiceOrderItemMutationResponse> {
  const response = await httpClient.put<ServiceOrderItemMutationResponse>(
    `/ordem-servico-item/${id}`,
    payload,
  );

  return unwrapApiResponse(response.data);
}
