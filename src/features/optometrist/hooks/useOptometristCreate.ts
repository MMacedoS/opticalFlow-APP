import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";
import type { OptometristFormValues } from "../types/optometrist.interface";
import { CreateOptometrist } from "../api/createOptometrist";

export function useOptometristCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OptometristFormValues) =>
      CreateOptometrist(payload),
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
      toast.error(getApiErrorMessage(error), {
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
