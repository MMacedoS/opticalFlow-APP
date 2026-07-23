import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeStatusAppointment } from "../api/changeStatusAppointment";
import type { StatusAtendimento } from "@/constants/statusColorEvents";

export function useAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: StatusAtendimento }) =>
      ChangeStatusAppointment(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointmentsList"] });
    },
    onError: (error) => {
      console.error("Erro ao mudar o status do atendimento:", error);
    },
  });
}
