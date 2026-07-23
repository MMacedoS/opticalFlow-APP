import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteAppointment } from "../api/deleteAppointment";

export function useAppointmentDelete() {
  const queryClient = useQueryClient();
  const deleteAppointment = useMutation({
    mutationFn: async (AppointmentId: string) => {
      await DeleteAppointment(AppointmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointmentsList"] });
    },
    onError: (error) => {
      toast.error(
        `Erro ao deletar o atendimento. Por favor, tente novamente. Error: ${error.message}`,
      );
    },
  });

  return deleteAppointment;
}
