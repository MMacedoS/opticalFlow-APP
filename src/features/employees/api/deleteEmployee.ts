import { httpClient } from "@/utils/axios";

export async function DeleteEmployee(employeeId: string): Promise<void> {
  try {
    await httpClient.delete(`/employees/${employeeId}`);
  } catch (error) {
    console.error("Erro ao deletar o funcionario:", error);
  }
}
