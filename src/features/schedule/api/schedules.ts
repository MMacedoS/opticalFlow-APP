import { httpClient } from "@/utils/axios";
import type {
  ScheduleListRequest,
  ScheduleListResponse,
} from "../type/schedule";

export async function getSchedules(
  payload: ScheduleListRequest,
): Promise<ScheduleListResponse> {
  const response = await httpClient.get<ScheduleListResponse>("/schedules", {
    params: payload,
  });

  return response.data;
}
