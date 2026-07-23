export async function getCustomers() {}
import { httpClient } from "@/utils/axios";

export async function ChangeStatusProduct(
  productId: string,
  newStatus: "ativo" | "inativo",
): Promise<void> {
  try {
    await httpClient.patch(`/products/${productId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Erro ao alterar o status do produto:", error);
    throw error;
  }
}
