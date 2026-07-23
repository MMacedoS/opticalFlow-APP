import { httpClient } from "@/utils/axios";
import type { ProductRequest, ProductResponse } from "../types/product.type";

export async function getProducts(
  payload: ProductRequest,
): Promise<ProductResponse> {
  const response = await httpClient.get<ProductResponse>("/products", {
    params: payload,
  });

  return response.data;
}
