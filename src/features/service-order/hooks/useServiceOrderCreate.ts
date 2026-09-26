import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createServiceOrder } from "../api/createServiceOrder";
import { getApiErrorMessage } from "../api/helpers";
import type { ServiceOrderCreatePayload } from "../types/service-order.type";

export function useServiceOrderCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ServiceOrderCreatePayload) => createServiceOrder(payload),
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
