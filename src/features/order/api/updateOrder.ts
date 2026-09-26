import { toast } from "sonner";
import { httpClient } from "@/utils/axios";
import type { OrderFormValues, OrderListResponse } from "../types/Order.type";

export function UpdateOrder(
  payload: OrderFormValues,
): Promise<OrderListResponse> {
  const id = payload.id;

  if (!id) {
    toast.error("ID da ordem não fornecido.", {
      action: {
        label: "Fechar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    return Promise.reject(new Error("ID da ordem não fornecido."));
  }
  return httpClient
    .put<OrderListResponse>(`/orders/${id}`, payload)
    .then((response) => response.data);
}
