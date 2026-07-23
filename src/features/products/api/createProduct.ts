import { httpClient } from "@/utils/axios";
import type { ProductFormValues, ProductResponse } from "../types/product.type";

export async function CreateProduct(
  payload: ProductFormValues,
): Promise<ProductResponse> {
  const response = await httpClient.post<ProductResponse>("/products", payload);
  return response.data;
}
