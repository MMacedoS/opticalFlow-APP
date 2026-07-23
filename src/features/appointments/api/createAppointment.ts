import { httpClient } from "@/utils/axios";
import type {
  AppointmentFormValues,
  AppointmentResponse,
} from "../types/appointment.type";

export async function CreateAppointment(
  payload: AppointmentFormValues,
): Promise<AppointmentResponse> {
  const response = await httpClient.post<AppointmentResponse>(
    "/appointments",
    payload,
  );
  return response.data;
}
