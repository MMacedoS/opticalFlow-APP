export async function getCustomers() {}
import type { StatusOrder } from "@/constants/statusColorEvents";
import { httpClient } from "@/utils/axios";

export async function ChangeStatusOrders(
  ordersId: string,
  newStatus: StatusOrder,
): Promise<void> {
  try {
    await httpClient.patch(`/orderss/${ordersId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Erro ao alterar o status do Ordem:", error);
    throw error;
  }
}
