import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteSchedule } from "../api/deleteSchedule";

export function useScheduleDelete() {
  const queryClient = useQueryClient();
  const deleteSchedule = useMutation({
    mutationFn: async (ScheduleId: string) => {
      await DeleteSchedule(ScheduleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedulesList"] });
    },
    onError: (error) => {
      toast.error(
        `Erro ao deletar o evento. Por favor, tente novamente. Error: ${error.message}`,
      );
    },
  });

  return deleteSchedule;
}
