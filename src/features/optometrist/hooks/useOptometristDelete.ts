import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteOptometrist } from "../api/deleteOptometrist";

export function useOptometristDelete() {
  const queryClient = useQueryClient();
  const deleteOptometrist = useMutation({
    mutationFn: async (OptometristId: string) => {
      await DeleteOptometrist(OptometristId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["optometristsList"] });
    },
    onError: (error) => {
      toast.error(
        `Erro ao deletar o optometrista. Por favor, tente novamente. Error: ${error.message}`,
      );
    },
  });

  return deleteOptometrist;
}
