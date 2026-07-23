import { httpClient } from "@/utils/axios";
import type { ProductRequest, ProductResponse } from "../types/product.type";

export async function getProductsList(
  payload: ProductRequest,
): Promise<ProductResponse> {
  const response = await httpClient.get<ProductResponse>("/products/all", {
    params: payload,
  });

  return response.data;
}
