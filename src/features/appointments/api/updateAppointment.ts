import { toast } from "sonner";
import { httpClient } from "@/utils/axios";
import type {
  AppointmentFormValues,
  AppointmentResponse,
} from "../types/appointment.type";

export function UpdateAppointment(
  payload: AppointmentFormValues,
): Promise<AppointmentResponse> {
  const id = payload.id;

  if (!id) {
    toast.error("ID do atendimento não fornecido.", {
      action: {
        label: "Fechar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    return Promise.reject(new Error("ID da atendimento não fornecido."));
  }
  return httpClient
    .put<AppointmentResponse>(`/Appointments/${id}`, payload)
    .then((response) => response.data);
}
