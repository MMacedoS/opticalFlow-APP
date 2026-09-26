import { httpClient } from "@/utils/axios";

export async function DeleteOrder(OrderId: string): Promise<void> {
  try {
    await httpClient.delete(`/orders/${OrderId}`);
  } catch (error) {
    console.error("Erro ao deletar o orderm:", error);
  }
}
