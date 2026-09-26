import { httpClient } from "@/utils/axios";
import type {
  AppointmentFormValues,
  AppointmentResponse,
} from "../types/appointment.type";

export async function CreateAppointment(
  payload: AppointmentFormValues,
): Promise<AppointmentResponse> {
  const cleanedPayload = { ...payload };
  delete cleanedPayload.temResponsavel;
  const response = await httpClient.post<AppointmentResponse>(
    "/atendimento",
    cleanedPayload,
  );
  return response.data;
}
