export async function getCustomers() {}
import type { StatusAtendimento } from "@/constants/statusColorEvents";
import { httpClient } from "@/utils/axios";

export async function ChangeStatusAppointment(
  appointmentId: string,
  newStatus: StatusAtendimento,
): Promise<void> {
  try {
    await httpClient.patch(`/appointments/${appointmentId}/status`, {
      status: newStatus,
    });
  } catch (error) {
    console.error("Erro ao alterar o status do atendimento:", error);
    throw error;
  }
}
