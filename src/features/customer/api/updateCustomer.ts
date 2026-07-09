import { toast } from "sonner";
import { httpClient } from "@/utils/axios";
import type {
  CustomerFormValues,
  CustomerResponse,
} from "../types/customer.type";

export function UpdateCustomer(
  payload: CustomerFormValues,
): Promise<CustomerResponse> {
  const id = payload.id;

  if (!id) {
    toast.error("ID do cliente não fornecido.", {
      action: {
        label: "Fechar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    return Promise.reject(new Error("ID da cliente não fornecido."));
  }
  return httpClient
    .put<CustomerResponse>(`/customers/${id}`, payload)
    .then((response) => response.data);
}
