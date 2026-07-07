import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteBranch } from "../api/deleteBranch";
import { toast } from "sonner";

export function useBranchDelete() {
  const queryClient = useQueryClient();
  const deleteBranch = useMutation({
    mutationFn: async (branchId: string) => {
      await DeleteBranch(branchId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branchList"] });
    },
    onError: (error) => {
      toast.error(
        `Erro ao deletar a filial. Por favor, tente novamente. Error: ${error.message}`,
      );
    },
  });

  return deleteBranch;
}
