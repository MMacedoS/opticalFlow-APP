import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppointmentFormValues } from "../types/appointment.type";
import { CreateAppointment } from "../api/createAppointment";
import { toast } from "sonner";

export function useAppointmentCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AppointmentFormValues) =>
      CreateAppointment(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ["appointmentsList"] });
    },
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    },
  });
}
