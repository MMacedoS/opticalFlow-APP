import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { OptometristFormValues } from "../types/optometrist.interface";
import { UpdateOptometrist } from "../api/updateOptometrist";

export function useOptometristUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OptometristFormValues) => UpdateOptometrist(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ["optometristsList"] });
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
