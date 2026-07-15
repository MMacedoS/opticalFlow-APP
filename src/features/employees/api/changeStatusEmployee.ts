import { httpClient } from "@/utils/axios";

export async function ChangeStatusEmployee(
  employeeId: string,
  newStatus: "ativo" | "inativo",
): Promise<void> {
  try {
    await httpClient.patch(`/employees/${employeeId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Erro ao alterar o status do funcionario:", error);
    throw error;
  }
}
