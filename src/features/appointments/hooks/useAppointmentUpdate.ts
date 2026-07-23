import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AppointmentFormValues } from "../types/appointment.type";
import { UpdateAppointment } from "../api/updateAppointment";

export function useAppointmentUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AppointmentFormValues) => UpdateAppointment(payload),
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
