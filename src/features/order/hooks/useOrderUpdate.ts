import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { OrderFormValues } from "../types/Order.type";
import { UpdateOrder } from "../api/updateOrder";

export function useOrderUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OrderFormValues) => UpdateOrder(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ["OrdersList"] });
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
