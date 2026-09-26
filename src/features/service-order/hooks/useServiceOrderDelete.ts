import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteServiceOrder } from "../api/deleteServiceOrder";
import { getApiErrorMessage } from "../api/helpers";

export function useServiceOrderDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceOrderId: string) => deleteServiceOrder(serviceOrderId),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => toast.dismiss(),
        },
      });

      queryClient.invalidateQueries({ queryKey: ["serviceOrdersList"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error), {
        action: {
          label: "Fechar",
          onClick: () => toast.dismiss(),
        },
      });
    },
  });
}
