import { httpClient } from "@/utils/axios";
import type { ProductFormInput } from "../schema/product.schema";
import type { ProductResponse } from "../types/product.type";

export async function CreateProduct(
  payload: ProductFormInput,
): Promise<ProductResponse> {
  const response = await httpClient.post<ProductResponse>("/products", payload);
  return response.data;
}
