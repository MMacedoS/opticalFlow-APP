import type { ScheduleFormValues } from "./../schema/scheduleSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateSchedule } from "../api/updateSchedule";

export function useScheduleUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ScheduleFormValues) => UpdateSchedule(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ["schedulesList"] });
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
