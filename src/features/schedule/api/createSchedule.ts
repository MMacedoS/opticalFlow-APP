import { httpClient } from "@/utils/axios";
import type { ScheduleFormValues } from "../schema/scheduleSchema";
import type { ScheduleListResponse } from "../type/schedule";

export async function CreateSchedule(
  payload: ScheduleFormValues,
): Promise<ScheduleListResponse> {
  const response = await httpClient.post<ScheduleListResponse>(
    "/schedules",
    payload,
  );
  return response.data;
}
