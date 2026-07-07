import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BranchFormValues } from "../types/branch.type";
import { UpdateBranch } from "../api/updateBranch";
import { toast } from "sonner";

export function useBranchUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BranchFormValues) => UpdateBranch(payload),
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
