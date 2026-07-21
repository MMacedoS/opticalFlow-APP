import { toast } from "sonner";
import { httpClient } from "@/utils/axios";
import type { ScheduleFormValues } from "../schema/scheduleSchema";
import type { ScheduleListResponse } from "../type/schedule";

export function UpdateSchedule(
  payload: ScheduleFormValues,
): Promise<ScheduleListResponse> {
  const id = payload.id;

  if (!id) {
    toast.error("ID do evento não fornecido.", {
      action: {
        label: "Fechar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    return Promise.reject(new Error("ID do evento não fornecido."));
  }
  return httpClient
    .put<ScheduleListResponse>(`/schedules/${id}`, payload)
    .then((response) => response.data);
}
