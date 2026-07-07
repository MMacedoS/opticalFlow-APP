import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeStatusBranch } from "../api/changeStatusBranch";

export function useBranchStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: "ativo" | "inativo" }) =>
      changeStatusBranch(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branchList"] });
    },
    onError: (error) => {
      console.error("Erro ao mudar o status da filial:", error);
    },
  });
}
