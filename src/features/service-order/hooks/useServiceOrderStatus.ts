import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateServiceOrder } from "../api/updateServiceOrder";
import { getApiErrorMessage } from "../api/helpers";
import type { ServiceOrderStatus } from "../types/service-order.type";

export function useServiceOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ServiceOrderStatus }) =>
      updateServiceOrder(id, { status }),
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
