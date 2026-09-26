import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OrderFormValues } from "../types/Order.type";
import { CreateOrder } from "../api/createOrder";
import { toast } from "sonner";

export function useOrderCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OrderFormValues) => CreateOrder(payload),
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
