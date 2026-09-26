import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateServiceOrder } from "../api/updateServiceOrder";
import { getApiErrorMessage } from "../api/helpers";
import type { ServiceOrderUpdatePayload } from "../types/service-order.type";

export function useServiceOrderUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ServiceOrderUpdatePayload;
    }) => updateServiceOrder(id, payload),
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
