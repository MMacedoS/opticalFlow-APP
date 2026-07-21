import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ScheduleFormValues } from "../schema/scheduleSchema";
import { CreateSchedule } from "../api/createSchedule";

export function useScheduleCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ScheduleFormValues) => CreateSchedule(payload),
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
