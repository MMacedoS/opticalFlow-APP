import { httpClient } from "@/utils/axios";

export async function DeleteProduct(productId: string): Promise<void> {
  try {
    await httpClient.delete(`/products/${productId}`);
  } catch (error) {
    console.error("Erro ao deletar o produto:", error);
  }
}
