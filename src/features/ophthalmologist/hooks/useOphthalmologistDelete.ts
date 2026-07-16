import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteOphthalmologist } from "../api/deleteOphthalmologist";

export function useOphthalmologistDelete() {
  const queryClient = useQueryClient();
  const deleteOphthalmologist = useMutation({
    mutationFn: async (ophthalmologistId: string) => {
      await DeleteOphthalmologist(ophthalmologistId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ophthalmologistsList"] });
    },
    onError: (error) => {
      toast.error(
        `Erro ao deletar o oftalmologista. Por favor, tente novamente. Error: ${error.message}`,
      );
    },
  });

  return deleteOphthalmologist;
}
