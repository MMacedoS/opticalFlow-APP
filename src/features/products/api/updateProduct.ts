import { toast } from "sonner";
import { httpClient } from "@/utils/axios";
import type { ProductResponse } from "../types/product.type";
import type { ProductFormInput } from "../schema/product.schema";

export function UpdateProduct(
  payload: ProductFormInput,
): Promise<ProductResponse> {
  const id = payload.id;

  if (!id) {
    toast.error("ID do produto não fornecido.", {
      action: {
        label: "Fechar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    return Promise.reject(new Error("ID do produto não fornecido."));
  }
  return httpClient
    .put<ProductResponse>(`/products/${id}`, payload)
    .then((response) => response.data);
}
