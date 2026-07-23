import { httpClient } from "@/utils/axios";
import type {
  AppointmentRequest,
  AppointmentResponse,
} from "../types/appointment.type";

export async function getAppointmentsList(
  payload: AppointmentRequest,
): Promise<AppointmentResponse> {
  const response = await httpClient.get<AppointmentResponse>(
    "/appointments/all",
    {
      params: payload,
    },
  );

  return response.data;
}
