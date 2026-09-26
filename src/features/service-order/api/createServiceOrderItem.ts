import { httpClient } from "@/utils/axios";
import { unwrapApiResponse } from "./helpers";
import type { ServiceOrderItemMutationResponse } from "../types/service-order-item.type";

export async function createServiceOrderItem(payload: {
  ordemServicoId: string;
  produtoId?: string;
  descricao_servico?: string;
  quantidade: number;
  valor_unitario: number;
  desconto?: number;
}): Promise<ServiceOrderItemMutationResponse> {
  const response = await httpClient.post<ServiceOrderItemMutationResponse>(
    "/ordem-servico-item",
    payload,
  );

  return unwrapApiResponse(response.data);
}
