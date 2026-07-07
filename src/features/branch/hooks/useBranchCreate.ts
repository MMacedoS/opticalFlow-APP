import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BranchFormValues } from "../types/branch.type";
import { toast } from "sonner";
import { createBranch } from "../api/createBranch";

export function useBranchCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: BranchFormValues) => createBranch(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ["branchList"] });
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
