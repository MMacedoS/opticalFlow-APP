import { httpClient } from "@/utils/axios";

export async function DeleteCustomer(customerId: string): Promise<void> {
  try {
    await httpClient.delete(`/customers/${customerId}`);
  } catch (error) {
    console.error("Erro ao deletar o cliente:", error);
  }
}
