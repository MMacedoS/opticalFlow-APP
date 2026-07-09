export async function getCustomers() {}
import { httpClient } from "@/utils/axios";

export async function ChangeStatusCustomer(
  customerId: string,
  newStatus: "ativo" | "inativo",
): Promise<void> {
  try {
    await httpClient.patch(`/customers/${customerId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Erro ao alterar o status do cliente:", error);
    throw error;
  }
}
