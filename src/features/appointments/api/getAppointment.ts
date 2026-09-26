import { httpClient } from "@/utils/axios";
import type {
  AppointmentRequest,
  AppointmentResponse,
} from "../types/appointment.type";

export async function getAppointments(
  payload: AppointmentRequest,
): Promise<AppointmentResponse> {
  const response = await httpClient.get<AppointmentResponse>("/atendimento", {
    params: payload,
  });

  return response.data;
}
